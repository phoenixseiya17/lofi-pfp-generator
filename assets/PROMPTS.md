# How the Yeti portraits were made

Every portrait in this folder is an AI-generated pixel-art image, made with
the same reference style: the three original preview portraits of Lofi the
Yeti (white + sunglasses + snow, gold + crown + neon city, blue + headphones
+ carnival). Each new portrait was generated from a clean reference — a
"plain" portrait with no accessory — plus a text prompt, then visually
checked: it had to be smooth pixel art, clearly a Yeti, same head-and-
shoulders composition, exactly one accessory, no distorted face.

## Shared style (appended to every prompt)

> Square head-and-shoulders pixel art portrait of the same yeti character
> as the reference image. Same style and composition as the reference:
> chunky visible pixels, bold black cartoon outlines, big blue face
> centered, fluffy fur framing the face, shoulders cut off at the bottom
> edge, rich detailed pixel background, no text.

## Per-image prompts (reference image + the varying part)

| File | Reference | Varying part |
|---|---|---|
| yeti-white-sunglasses-snow.png | original preview 1 | white fur, black sunglasses, snowy arctic mountains |
| yeti-white-plain-snow.png | original preview 1 | white fur, plain, no accessory, snowy arctic mountains |
| yeti-white-beanie-sky.png | original preview 1 | white fur, ONLY a red knitted beanie with pompom, NO sunglasses, normal eyes visible, pastel gradient sky |
| yeti-blue-headphones-carnival.png | original preview 3 | blue fur, big headphones around the neck, carnival with ferris wheel |
| yeti-blue-plain-sky.png | original preview 3 | light blue fur, plain, no accessory, pastel gradient sky |
| yeti-blue-sunglasses-neon.png | yeti-blue-plain-sky.png | light blue fur, black sunglasses, NO headphones, NO crown, purple neon city at night |
| yeti-blue-crown-snow.png | yeti-blue-plain-sky.png | light blue fur, small golden crown, NO sunglasses, NO headphones, snowy arctic mountains |
| yeti-gold-crown-neon.png | original preview 2 | gold fur, small golden crown, purple neon city at night |
| yeti-gold-plain-sky.png | original preview 2 | golden yellow fur, plain, no accessory, pastel gradient sky |
| yeti-gold-headphones-carnival.png | yeti-gold-plain-sky.png | gold fur, big headphones around the neck, NO sunglasses, NO crown, carnival with ferris wheel |
| yeti-pink-plain-snow.png | yeti-white-plain-snow.png | soft pink fur, plain, no accessory, snowy arctic mountains |
| yeti-pink-sunglasses-neon.png | yeti-blue-sunglasses-neon.png | soft pink fur, black sunglasses, NO headphones, NO crown, purple neon city at night |
| yeti-pink-crown-carnival.png | yeti-blue-crown-snow.png | soft pink fur, small golden crown, NO sunglasses, NO headphones, carnival with ferris wheel |
| yeti-mint-plain-sky.png | yeti-white-plain-snow.png | mint green fur, plain, no accessory, pastel gradient sky |
| yeti-mint-beanie-snow.png | yeti-white-beanie-sky.png | mint green fur, red knitted beanie with pompom, NO sunglasses, snowy arctic mountains |
| yeti-mint-headphones-night.png | yeti-gold-headphones-carnival.png | mint green fur, big headphones around the neck, NO sunglasses, NO crown, starry night sky with crescent moon |
| yeti-purple-plain-neon.png | yeti-white-plain-snow.png | purple fur, plain, no accessory, purple neon city at night |
| yeti-purple-sunglasses-carnival.png | yeti-blue-sunglasses-neon.png | purple fur, black sunglasses, NO headphones, NO crown, carnival with ferris wheel |
| yeti-purple-crown-night.png | yeti-blue-crown-snow.png | purple fur, small golden crown, NO sunglasses, NO headphones, starry night sky with crescent moon |
| yeti-white-crown-neon.png | yeti-white-plain-snow.png | white fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, purple neon city at night |
| yeti-white-headphones-neon.png | yeti-white-plain-snow.png | white fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, purple neon city at night |
| yeti-white-plain-neon.png | yeti-white-plain-snow.png | white fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, purple neon city at night |
| yeti-white-sunglasses-neon.png | yeti-white-plain-snow.png | white fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, purple neon city at night |
| yeti-white-beanie-carnival.png | yeti-white-plain-snow.png | white fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, carnival with ferris wheel |
| yeti-white-crown-carnival.png | yeti-white-plain-snow.png | white fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-blue-beanie-carnival.png | yeti-blue-plain-sky.png | light blue fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, carnival with ferris wheel |
| yeti-blue-crown-neon.png | yeti-blue-plain-sky.png | light blue fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, purple neon city at night |
| yeti-blue-headphones-neon.png | yeti-blue-plain-sky.png | light blue fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, purple neon city at night |
| yeti-blue-plain-neon.png | yeti-blue-plain-sky.png | light blue fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, purple neon city at night |
| yeti-blue-sunglasses-snow.png | yeti-blue-plain-sky.png | light blue fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-gold-beanie-sky.png | yeti-gold-plain-sky.png | golden yellow fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, pastel gradient sky |
| yeti-gold-crown-snow.png | yeti-gold-plain-sky.png | golden yellow fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-gold-headphones-neon.png | yeti-gold-plain-sky.png | golden yellow fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, purple neon city at night |
| yeti-gold-plain-neon.png | yeti-gold-plain-sky.png | golden yellow fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, purple neon city at night |
| yeti-gold-sunglasses-neon.png | yeti-gold-plain-sky.png | golden yellow fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, purple neon city at night |
| yeti-gold-beanie-carnival.png | yeti-gold-plain-sky.png | golden yellow fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, carnival with ferris wheel |
| yeti-mint-crown-neon.png | yeti-mint-plain-sky.png | mint green fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, purple neon city at night |
| yeti-mint-plain-neon.png | yeti-mint-plain-sky.png | mint green fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, purple neon city at night |
| yeti-mint-sunglasses-neon.png | yeti-mint-plain-sky.png | mint green fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, purple neon city at night |
| yeti-mint-beanie-carnival.png | yeti-mint-plain-sky.png | mint green fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, carnival with ferris wheel |
| yeti-mint-headphones-carnival.png | yeti-mint-plain-sky.png | mint green fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-pink-beanie-neon.png | yeti-pink-plain-snow.png | soft pink fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, purple neon city at night |
| yeti-pink-headphones-neon.png | yeti-pink-plain-snow.png | soft pink fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, purple neon city at night |
| yeti-pink-plain-neon.png | yeti-pink-plain-snow.png | soft pink fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, purple neon city at night |
| yeti-pink-sunglasses-snow.png | yeti-pink-plain-snow.png | soft pink fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-pink-crown-neon.png | yeti-pink-plain-snow.png | soft pink fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, purple neon city at night |
| yeti-purple-beanie-sky.png | yeti-purple-plain-neon.png | purple fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, pastel gradient sky |
| yeti-purple-headphones-neon.png | yeti-purple-plain-neon.png | purple fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, purple neon city at night |
| yeti-purple-plain-snow.png | yeti-purple-plain-neon.png | purple fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-purple-sunglasses-neon.png | yeti-purple-plain-neon.png | purple fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, purple neon city at night |

## Lessons from generating the set

- Reference images carry their own accessories: a reference with
  sunglasses or headphones will pass them on to the new image. Always
  generate from a clean "plain" reference and name the one accessory you
  want, plus "NO sunglasses, NO headphones, NO crown, NO other accessory".
- One generation in three came back with a second accessory smuggled in;
  those were regenerated from a clean reference, never patched.
| yeti-white-plain-sky.png | yeti-white-plain-snow.png | white fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, pastel gradient sky |
| yeti-white-plain-night.png | yeti-white-plain-snow.png | white fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-white-plain-carnival.png | yeti-white-plain-snow.png | white fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-white-sunglasses-sky.png | yeti-white-plain-snow.png | white fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, pastel gradient sky |
| yeti-white-sunglasses-night.png | yeti-white-plain-snow.png | white fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-white-sunglasses-carnival.png | yeti-white-plain-snow.png | white fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-white-crown-snow.png | yeti-white-plain-snow.png | white fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-white-crown-sky.png | yeti-white-plain-snow.png | white fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, pastel gradient sky |
| yeti-white-crown-night.png | yeti-white-plain-snow.png | white fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-white-headphones-snow.png | yeti-white-plain-snow.png | white fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-white-headphones-sky.png | yeti-white-plain-snow.png | white fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, pastel gradient sky |
| yeti-white-headphones-night.png | yeti-white-plain-snow.png | white fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-white-headphones-carnival.png | yeti-white-plain-snow.png | white fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-white-beanie-snow.png | yeti-white-plain-snow.png | white fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, snowy arctic mountains |
| yeti-white-beanie-night.png | yeti-white-plain-snow.png | white fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, starry night sky with crescent moon |
| yeti-white-beanie-neon.png | yeti-white-plain-snow.png | white fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, purple neon city at night |
| yeti-blue-plain-snow.png | yeti-blue-plain-sky.png | light blue fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-blue-plain-night.png | yeti-blue-plain-sky.png | light blue fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-blue-plain-carnival.png | yeti-blue-plain-sky.png | light blue fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-blue-sunglasses-sky.png | yeti-blue-plain-sky.png | light blue fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, pastel gradient sky |
| yeti-blue-sunglasses-night.png | yeti-blue-plain-sky.png | light blue fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-blue-sunglasses-carnival.png | yeti-blue-plain-sky.png | light blue fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-blue-crown-sky.png | yeti-blue-plain-sky.png | light blue fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, pastel gradient sky |
| yeti-blue-crown-night.png | yeti-blue-plain-sky.png | light blue fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-blue-crown-carnival.png | yeti-blue-plain-sky.png | light blue fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-blue-headphones-snow.png | yeti-blue-plain-sky.png | light blue fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-blue-headphones-sky.png | yeti-blue-plain-sky.png | light blue fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, pastel gradient sky |
| yeti-blue-headphones-night.png | yeti-blue-plain-sky.png | light blue fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-blue-beanie-snow.png | yeti-blue-plain-sky.png | light blue fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, snowy arctic mountains |
| yeti-blue-beanie-sky.png | yeti-blue-plain-sky.png | light blue fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, pastel gradient sky |
| yeti-blue-beanie-night.png | yeti-blue-plain-sky.png | light blue fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, starry night sky with crescent moon |
| yeti-blue-beanie-neon.png | yeti-blue-plain-sky.png | light blue fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, purple neon city at night |
| yeti-mint-plain-snow.png | yeti-mint-plain-sky.png | mint green fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-mint-plain-night.png | yeti-mint-plain-sky.png | mint green fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-mint-plain-carnival.png | yeti-mint-plain-sky.png | mint green fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-mint-sunglasses-snow.png | yeti-mint-plain-sky.png | mint green fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-mint-sunglasses-sky.png | yeti-mint-plain-sky.png | mint green fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, pastel gradient sky |
| yeti-mint-sunglasses-night.png | yeti-mint-plain-sky.png | mint green fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-mint-sunglasses-carnival.png | yeti-mint-plain-sky.png | mint green fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-mint-crown-snow.png | yeti-mint-plain-sky.png | mint green fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-mint-crown-sky.png | yeti-mint-plain-sky.png | mint green fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, pastel gradient sky |
| yeti-mint-crown-night.png | yeti-mint-plain-sky.png | mint green fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-mint-crown-carnival.png | yeti-mint-plain-sky.png | mint green fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-mint-headphones-snow.png | yeti-mint-plain-sky.png | mint green fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-mint-headphones-sky.png | yeti-mint-plain-sky.png | mint green fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, pastel gradient sky |
| yeti-mint-headphones-neon.png | yeti-mint-plain-sky.png | mint green fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, purple neon city at night |
| yeti-mint-beanie-sky.png | yeti-mint-plain-sky.png | mint green fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, pastel gradient sky |
| yeti-mint-beanie-night.png | yeti-mint-plain-sky.png | mint green fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, starry night sky with crescent moon |
| yeti-mint-beanie-neon.png | yeti-mint-plain-sky.png | mint green fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, purple neon city at night |
| yeti-pink-plain-sky.png | yeti-pink-plain-snow.png | soft pink fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, pastel gradient sky |
| yeti-pink-plain-night.png | yeti-pink-plain-snow.png | soft pink fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-pink-plain-carnival.png | yeti-pink-plain-snow.png | soft pink fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-pink-sunglasses-sky.png | yeti-pink-plain-snow.png | soft pink fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, pastel gradient sky |
| yeti-pink-sunglasses-night.png | yeti-pink-plain-snow.png | soft pink fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-pink-sunglasses-carnival.png | yeti-pink-plain-snow.png | soft pink fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-pink-crown-snow.png | yeti-pink-plain-snow.png | soft pink fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-pink-crown-sky.png | yeti-pink-plain-snow.png | soft pink fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, pastel gradient sky |
| yeti-pink-crown-night.png | yeti-pink-plain-snow.png | soft pink fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-pink-headphones-snow.png | yeti-pink-plain-snow.png | soft pink fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-pink-headphones-sky.png | yeti-pink-plain-snow.png | soft pink fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, pastel gradient sky |
| yeti-pink-headphones-night.png | yeti-pink-plain-snow.png | soft pink fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-pink-headphones-carnival.png | yeti-pink-plain-snow.png | soft pink fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-pink-beanie-snow.png | yeti-pink-plain-snow.png | soft pink fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, snowy arctic mountains |
| yeti-pink-beanie-sky.png | yeti-pink-plain-snow.png | soft pink fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, pastel gradient sky |
| yeti-pink-beanie-night.png | yeti-pink-plain-snow.png | soft pink fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, starry night sky with crescent moon |
| yeti-pink-beanie-carnival.png | yeti-pink-plain-snow.png | soft pink fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, carnival with ferris wheel |
| yeti-purple-plain-sky.png | yeti-purple-plain-neon.png | purple fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, pastel gradient sky |
| yeti-purple-plain-night.png | yeti-purple-plain-neon.png | purple fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-purple-plain-carnival.png | yeti-purple-plain-neon.png | purple fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-purple-sunglasses-snow.png | yeti-purple-plain-neon.png | purple fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-purple-sunglasses-sky.png | yeti-purple-plain-neon.png | purple fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, pastel gradient sky |
| yeti-purple-sunglasses-night.png | yeti-purple-plain-neon.png | purple fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-purple-crown-snow.png | yeti-purple-plain-neon.png | purple fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-purple-crown-sky.png | yeti-purple-plain-neon.png | purple fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, pastel gradient sky |
| yeti-purple-crown-carnival.png | yeti-purple-plain-neon.png | purple fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-purple-crown-neon.png | yeti-purple-plain-neon.png | purple fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, purple neon city at night |
| yeti-purple-headphones-snow.png | yeti-purple-plain-neon.png | purple fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-purple-headphones-sky.png | yeti-purple-plain-neon.png | purple fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, pastel gradient sky |
| yeti-purple-headphones-night.png | yeti-purple-plain-neon.png | purple fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-purple-headphones-carnival.png | yeti-purple-plain-neon.png | purple fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-purple-beanie-snow.png | yeti-purple-plain-neon.png | purple fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, snowy arctic mountains |
| yeti-purple-beanie-night.png | yeti-purple-plain-neon.png | purple fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, starry night sky with crescent moon |
| yeti-purple-beanie-carnival.png | yeti-purple-plain-neon.png | purple fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, carnival with ferris wheel |
| yeti-purple-beanie-neon.png | yeti-purple-plain-neon.png | purple fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, purple neon city at night |
| yeti-gold-plain-snow.png | yeti-gold-plain-sky.png | golden yellow fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-gold-plain-night.png | yeti-gold-plain-sky.png | golden yellow fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-gold-plain-carnival.png | yeti-gold-plain-sky.png | golden yellow fur, plain, no accessory, NO sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-gold-sunglasses-snow.png | yeti-gold-plain-sky.png | golden yellow fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-gold-sunglasses-sky.png | yeti-gold-plain-sky.png | golden yellow fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, pastel gradient sky |
| yeti-gold-sunglasses-night.png | yeti-gold-plain-sky.png | golden yellow fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-gold-sunglasses-carnival.png | yeti-gold-plain-sky.png | golden yellow fur, black sunglasses, NO headphones, NO crown, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-gold-crown-sky.png | yeti-gold-plain-sky.png | golden yellow fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, pastel gradient sky |
| yeti-gold-crown-night.png | yeti-gold-plain-sky.png | golden yellow fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-gold-crown-carnival.png | yeti-gold-plain-sky.png | golden yellow fur, small golden crown, NO sunglasses, NO headphones, NO beanie, NO other accessory, carnival with ferris wheel |
| yeti-gold-headphones-snow.png | yeti-gold-plain-sky.png | golden yellow fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, snowy arctic mountains |
| yeti-gold-headphones-sky.png | yeti-gold-plain-sky.png | golden yellow fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, pastel gradient sky |
| yeti-gold-headphones-night.png | yeti-gold-plain-sky.png | golden yellow fur, big headphones around the neck, NO sunglasses, NO crown, NO beanie, NO other accessory, starry night sky with crescent moon |
| yeti-gold-beanie-snow.png | yeti-gold-plain-sky.png | golden yellow fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, snowy arctic mountains |
| yeti-gold-beanie-night.png | yeti-gold-plain-sky.png | golden yellow fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, starry night sky with crescent moon |
| yeti-gold-beanie-neon.png | yeti-gold-plain-sky.png | golden yellow fur, ONLY a red knitted beanie with pompom, NO sunglasses, NO headphones, NO crown, normal eyes visible, NO other accessory, purple neon city at night |
