/* eslint-disable max-classes-per-file */
import assert from 'assert'
import { prompt } from 'enquirer'
import execa from 'execa'
import findPkg, { PkgProxy } from 'pkg-proxy'
import { Argv } from 'yargs'

abstract class Project {
  readonly pkg

  constructor(pkg: PkgProxy) {
    this.pkg = pkg
  }

  abstract get type(): string

  abstract detect(): boolean

  abstract install(): Promise<void>

  hasAnyDeps(deps: string[]) {
    const { pkg } = this
    return deps.some((x) => pkg.depends(x))
  }

  async confirmRun(cmd: string) {
    const response = await prompt<{ run: boolean }>([
      {
        type: 'confirm',
        name: 'run',
        initial: true,
        hint: `\n${cmd}`,
        message: 'Run?',
      },
    ])
    return response.run
  }
}

class CapacitorProject extends Project {
  get type() {
    return 'capacitor'
  }

  detect() {
    const { pkg } = this
    if (pkg.capacitor) return true
    return pkg.depends('@capacitor/core')
  }

  async install() {
    const { pkg } = this
    if (
      !(await this.confirmRun(`npm install @admob-plus/capacitor
npx cap sync`))
    ) {
      return
    }

    await execa('npm', ['install', '@admob-plus/capacitor'], {
      cwd: pkg.rootDir(),
    })
    await execa('npx', ['cap', 'sync'], {
      cwd: pkg.rootDir(),
    })
  }
}

class CordovaProject extends Project {
  get type() {
    return 'cordova'
  }

  detect() {
    const { pkg } = this
    if (pkg.cordova) return true
    return this.hasAnyDeps([
      'cordova',
      'cordova-android',
      'cordova-browser',
      'cordova-ios',
      'cordova-plugin-whitelist',
    ])
  }

  async install() {
    const pluginName = 'admob-plus-cordova'
    const args = ['cordova', 'plugin', 'add', pluginName, '--save']

    await prompt([
      {
        type: 'form',
        name: 'vars',
        message: 'Input variables',
        choices: ['APP_ID_ANDROID', 'APP_ID_IOS'].map((name) => ({
          name,
        })),
        result(value) {
          Object.entries(value).forEach(([k, v]) => {
            v = v.trim()
            if (!v) return
            args.push('--variable', `${k.trim()}=${v}`)
          })
          return value
        },
      },
    ])

    if (await this.confirmRun(args.join(' '))) {
      await execa(args[0], args.slice(1), { cwd: this.pkg.rootDir() })
    }
  }
}

class IonicProject extends Project {
  get type() {
    return 'ionic'
  }

  detect() {
    return this.hasAnyDeps([
      '@ionic-native/core',
      '@ionic/angular',
      '@ionic/react',
      '@ionic/vue',
    ])
  }

  install(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

class ReactNativeProject extends Project {
  get type() {
    return 'react-native'
  }

  detect() {
    return this.pkg.depends('react-native')
  }

  async install() {
    const { pkg } = this
    if (!(await this.confirmRun('@admob-plus/react-native'))) {
      return
    }

    await execa('npm', ['install', '@admob-plus/react-native'], {
      cwd: pkg.rootDir(),
    })
  }
}

const projects = [
  CapacitorProject,
  CordovaProject,
  IonicProject,
  ReactNativeProject,
]

export const command = 'install'

export const desc = 'Install plugin'

export const builder = (yargs: Argv<unknown>) =>
  yargs.options({
    project: {
      alias: 'p',
      type: 'string',
      desc: 'Project type',
      choices: projects.map((P) => new P({} as any).type),
    },
  })

export const handler = async (argv: ReturnType<typeof builder>['argv']) => {
  const pkg = await findPkg({ searchParents: true })
  if (!pkg) {
    console.log('Cannot find package.json')
    return
  }

  const projectHandlers = projects.map((P) => new P(pkg))
  let project: Project | undefined
  if (argv.project) {
    project = projectHandlers.find((x) => x.type === argv.project)
    assert(project)
  } else {
    let initial = projectHandlers.findIndex((x) => x.detect())
    if (projectHandlers[initial] instanceof CordovaProject) {
      const i = projectHandlers
        .filter((x) => !(x instanceof CordovaProject))
        .findIndex((x) => x.detect())
      if (i >= -1) {
        initial = i
      }
    }
    const response = await prompt<{ project: Project }>({
      type: 'select',
      name: 'project',
      message: 'Project type?',
      choices: projectHandlers.map((x) => x.type),
      initial,
      result(value) {
        return projectHandlers.find((x) => x.type === value) as any
      },
    })
    project = response.project
  }

  await project.install()
}
