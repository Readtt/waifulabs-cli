[![npm](https://img.shields.io/npm/v/waifulabs-cli.svg)](https://www.npmjs.com/package/waifulabs-cli)
[![npm](https://img.shields.io/npm/dt/waifulabs-cli.svg?maxAge=3600)](https://www.npmjs.com/package/waifulabs-cli)
[![install size](https://packagephobia.now.sh/badge?p=waifulabs-cli)](https://www.npmjs.com/package/waifulabs-cli)

![NPM](https://nodei.co/npm/waifulabs-cli.png?downloads=true&downloadRank=true&stars=true)

![](https://i.imgur.com/oahCl2z.png)

# WaifuLabs CLI

## Installation
```
npm i -g waifulabs-cli
```
Make your own waifu in minutes!

## Usage (lite/random)

``
F:\waifulabs>waifulabs --lite
``
<br>
``
F:\waifulabs>waifulabs --random
``

## NOTES
- `waifulabs --lite`
    - 16 waifus are all compressed into one png image.
    - You can choose a waifu by going to the designated step image (steps/step {x}.png) and selecting one from left to right (0 - 15)
- `waifulabs --random`
    - Soon, you'll be able to choose between big, pillow and poster
- `waifulabs`
    - You'll be able to see what waifu you've chosen, everything will be more detailed.

## FOLDER ORDER:
- `waifulabs --lite` & `waifulabs` (both will be using this folder format)
    - `steps/`
        - `waifus/`
            - `big/` (big waifu)
            - `default/` (default waifu)
            - `pillow/` (pillow waifu)
            - `poster/` (poster waifu)
        - `step 0.png` (16 waifus)
        - `step 1.png` (16 waifu palette options)
        - `step 2.png` (16 waifu details options)
        - `step 3.png` (16 waifu poses options)
- `waifulabs --random`
    - `waifu/` (will have a random waifu)

# TODO
- Finish `waifulabs`
