---
id: "bannerad"
title: "Class: BannerAd"
sidebar_label: "BannerAd"
sidebar_position: 0
custom_edit_url: null
---

# Class: BannerAd

## Hierarchy

- [*MobileAd*](mobilead.md)<[*BannerAdOptions*](../interfaces/banneradoptions.md)\>

  ↳ **BannerAd**

## Constructors

### constructor

\+ **new BannerAd**(`opts`: [*BannerAdOptions*](../interfaces/banneradoptions.md)): [*BannerAd*](bannerad.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [*BannerAdOptions*](../interfaces/banneradoptions.md) |

**Returns:** [*BannerAd*](bannerad.md)

Overrides: [MobileAd](mobilead.md)

Defined in: banner.ts:46

## Properties

### \_loaded

• `Private` **\_loaded**: *boolean*= false

Defined in: banner.ts:46

___

### id

• `Readonly` **id**: *number*

Inherited from: [MobileAd](mobilead.md).[id](mobilead.md#id)

Defined in: api.ts:11

___

### opts

• `Protected` `Readonly` **opts**: [*BannerAdOptions*](../interfaces/banneradoptions.md)

Inherited from: [MobileAd](mobilead.md).[opts](mobilead.md#opts)

Defined in: api.ts:13

## Accessors

### adUnitId

• get **adUnitId**(): *string*

**Returns:** *string*

Defined in: api.ts:31

## Methods

### hide

▸ **hide**(): *Promise*<unknown\>

**Returns:** *Promise*<unknown\>

Defined in: banner.ts:86

___

### load

▸ **load**(): *Promise*<unknown\>

**Returns:** *Promise*<unknown\>

Defined in: banner.ts:70

___

### show

▸ **show**(): *Promise*<unknown\>

**Returns:** *Promise*<unknown\>

Defined in: banner.ts:78

___

### config

▸ `Static` **config**(`opts`: { `backgroundColor?`: *string* ; `marginBottom?`: *number* ; `marginTop?`: *number*  }): ``false`` \| *Promise*<unknown\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | *object* |
| `opts.backgroundColor?` | *string* |
| `opts.marginBottom?` | *number* |
| `opts.marginTop?` | *number* |

**Returns:** ``false`` \| *Promise*<unknown\>

Defined in: banner.ts:56

___

### getAdById

▸ `Static` **getAdById**(`id`: *number*): [*MobileAd*](mobilead.md)<[*MobileAdOptions*](../index.md#mobileadoptions)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | *number* |

**Returns:** [*MobileAd*](mobilead.md)<[*MobileAdOptions*](../index.md#mobileadoptions)\>

Inherited from: [MobileAd](mobilead.md)

Defined in: api.ts:22
