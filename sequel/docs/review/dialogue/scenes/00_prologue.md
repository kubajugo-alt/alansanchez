# The prologue: 21 December 1995

From `js/story/prologue.js`, scene by scene. Each scene is a room (its hotspots' lines) or one scripted moment. Lines are in the order they appear in the code; *[choice]* is a line the player picks in a conversation, *[if]* a line that depends on the day or on what has happened, *[set]* one of a set the code picks from. *(no recording)* marks a line shown as a caption only. Indented italics are the code's stage directions.

## room elena_car

- **Elena**: Static. And under the static, surf. [pause] There's no surf up here. *[if]* `elena_look_radio_2`
- **Elena**: Radio Las Palmas. Still awake. Someone has to be. *[if]* `elena_look_radio`
- **Elena**: Static. And under the static, surf. [pause] There's no surf up here. *[if]* `elena_look_radio_2`
- **Elena**: A timple, quick and bright, and a woman singing about a fisherman's wife. Leave it. It's company. *[if]* `elena_use_radio`
- **Elena**: Seven circles in a row, on the floor of the chamber under the cave. Six filled in. The seventh gone over so hard the paper's torn. [pause] Six. There should be seven. `elena_look_notebook`
- **Elena**: Seven circles in a row, on the floor of the chamber under the cave. Six filled in. The seventh gone over so hard the paper's torn. [pause] Six. There should be seven. `elena_look_notebook`
- **Elena**: Nada behind me. Nothing at all. *[if]* `elena_look_mirror_2`
- **Elena**: The lights of the camp, going out one by one. One window still lit. [pause] Rayco's still up. He never sleeps. *[if]* `elena_look_mirror`
- **Elena**: The handle's wet. Why is the handle wet? *[if]* `elena_crank_stuck_look`
- **Elena**: The window crank. It sticks, like everything in this car. *[if]* `elena_look_crank`
- **Elena**: It won't turn. Come on. Come on. *[if]* `elena_crank_stuck`
- **Elena**: An inch. Cold air, and pine. [pause] Smells like mountains. Good. *[if]* `elena_use_crank`
- **Elena**: Salt. [pause] Why is it salt? `elena_look_air`
  *the cloud outside: silver under the moon, then grey, then black*
  *the stars and the moon over the sea of cloud, before she drives down into it*
  *the moonlight on the cloud tops*
  *the radio's dial*
  *headlights on nothing*
  *the condensation, and the triangle her finger draws in it*

## S.intoCloud

- **Elena**: Into the cloud. [pause] Grey. Darker. [pause] Like driving into ink. `elena_pro_cloud`

## S.theWater

- **Elena**: Water on the inside of the glass. On the inside. `elena_salt`
- **Elena**: And at my feet. Cold, and coming up. [pause] From below. `elena_pro_feet`
- **Elena**: The brake. [pause] Nada. It won't slow. It's driving itself, as if it knows the way. `elena_pro_brake`
- **Elena**: The doors. [pause] No. It's a door, Carmen. I told you it was a door. `elena_doors`
  *she stops trying the doors, and draws on the glass (drawn: the triangle, point down)*
- **Elena**: Point down. [pause] At the sea. `elena_pro_triangle`

## S.prologue

> the whole prologue; returns on black, before the title card

- **Narrator**: Artenara, the last bar on the mountain, closing. At the telephone on the wall, feeding it coins: Dr. Elena Suárez, awake since five. `narr_pro_bar_1`
- **Carmen**: Trujillo. Speak, or don't. `carmen_machine`
- **Elena**: Carmen. It's me. I know it's late. [pause] Somebody's taken one of the discs out of the floor. The wear marks are fresh. It isn't conservation. `elena_msg_01`
- **Elena**: And it isn't a calendar either. I've been reading it wrong for a year. [pause] It's a door, Carmen. And someone's opening it. `elena_msg_02`
- **Elena**: I'm driving down now. Don't smoke all of them before I get there. [pause] Te quiero. `elena_msg_03`
- **Barman**: There's cloud on the road, doctora. Thick tonight. Stay. My wife will make up the room. `barman_stay`
- **Elena**: There's always cloud on the road. `elena_stay`
- **Elena**: Hairpins all the way down, and the cloud waiting at the bottom. [pause] Silver tonight. Like a frozen sea. `elena_pro_road`
  *the player looks around the car until the cloud, and the water, take it*
- **Guardia**: Doors locked from the inside, windows up. [pause] And mira, on the windscreen. A triangle, dried white. It's salt. `gc_locked`
- **Guardia**: Flash flood. Has to be. `gc_01`
- **Guardia**: There's no water in this barranco, hombre. `gc_02`
  *(the older one lights a cigarette, and looks at the car a long time)*
- **Guardia**: Then it went somewhere. `gc_03`
- **Narrator**: Her lungs were full of water, and the water was salt. It hadn't rained on that side of the mountain for forty days. `narr_open_01`
- **Narrator**: After that, once a month, at the dark of the moon, someone drowned in a dry place on the island. Nobody put them side by side. `narr_open_03`
