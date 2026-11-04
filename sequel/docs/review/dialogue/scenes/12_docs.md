# Close-ups: letters, papers, notebooks

From `js/story/docs.js`, scene by scene. Each scene is a room (its hotspots' lines) or one scripted moment. Lines are in the order they appear in the code; *[choice]* is a line the player picks in a conversation, *[if]* a line that depends on the day or on what has happened, *[set]* one of a set the code picks from. *(no recording)* marks a line shown as a caption only. Indented italics are the code's stage directions.

## S.readPaper

- **Alan**: José Santana. Drowned in his bed, last month. Floor dry. [pause] Maria Coutinho, in Lisbon, the same. It's the same. *[if]* `alan_read_paper_pepe`
- **Alan**: Six since December. One a month. Every new moon. [pause] And the discs. One a month. *[if]* `alan_read_paper_agustin`
- **Alan**: Montesdeoca, who owns our hotel, wants to build another one in the south. Bigger. With a waterfall. [pause] And the weather: panza de burro until further notice. At least they're honest. *[if]* `alan_read_paper_tue`
- **Alan**: Bonfires, sponsors, the weather. Nothing about mist. Nothing about the sea. Not yet. *[if]* `alan_read_paper`

## S.writeCard

> Tuesday's postcard to Inês (bought and posted at Chano's kiosk, js/story/tue.js): written from the inventory

- **Alan**: Las Canteras in full sun, in colours the real one has never once managed. `alan_look_postcard`
- **Alan**: Inês. Arrived. Luggage in Madrid. Vasco is radiant, there's no other word for it. He kissed me in front of two nuns. [pause] I don't know why that makes me want to cry. Don't tell him. A. `alan_postcard_write`
- **Alan**: Written. Now it just has to get to Lisbon before I do. `alan_postcard_written`

## S.readInscription

> ---------------------------------------------------------------- the bell and the founders

- **Alan**: SANTA ANA ROGA POR NOS. Sanches me fez, 1751. And the mark. *(no recording)* `alan_look_inscription`

## S.readLetter

- **Alan**: One word in four. 'Lock'. 'Mountain'. 'Water'. 'Last'. [pause] I don't like any of them. `alan_look_letter`

## S.readFax

- **Alan**: In her hand, every word I guessed this morning. [pause] Taken back from it: Pepe. Doña Pino. [pause] Whoever understands the lock: Elena. *[if]* *(no recording)* `alan_read_fax_1`
- **Alan**: And whoever shuts it goes down with it. [pause] 'Pray God it is not you.' They wrote that to the next founder. *[if]* *(no recording)* `alan_read_fax_2`
- **Alan**: The letter, decoded. In Inês's handwriting, which is worse than the eighteenth century's. `alan_look_fax`

## S.readGalindo

- **Alan**: 'They bathed in the sea at set times.' Underlined twice in pencil. Someone had an idea about this, once. `alan_look_galindo`

## S.readDiscList

> ---------------------------------------------------------------- the museum

  *(one a month, at the new moon, from the winter turning: CAVE6.md; the seventh, the sun, never left)*
- **Alan**: The list. Six out, one a month, like pills. Like nails out of a coffin. One line left. *[if]* `alan_look_disclist_late`
- **Alan**: The list on the board. 'Removed for conservation.' One a month since December, six dates, six lines. Initialled R. B. And one more line at the bottom, left blank. *[if]* `alan_look_disclist`

## S.readSketchbook

> ---------------------------------------------------------------- Rafa

  *(the laughing man, "el portugués. Triste.", is on the sketchbook's spread now)*
- **Alan**: A napkin from the bar, tucked in like a bookmark. The boy at the corner table. Yeray, from the dig. *[if]* *(no recording)* `alan_read_sketchbook_1`
- **Alan**: And round him, in Rafa's pencil, the things he said. Written down while I was busy not listening. *[if]* `alan_read_sketchbook_2`
- **Alan**: And me. 'El portugués. Triste.' [pause] He's a good artist. *[if]* `alan_read_sketchbook_3`

## S.lookDrawing

- **Alan**: Me, asleep, in charcoal. Younger than I've any right to look. [pause] It's the most beautiful thing anyone's made of me, and I feel sick. `alan_look_drawing`

## S.readCharts

- **Vasco**: Her drawings of the row of sockets, a sign by each, crossed out and drawn again. [pause] And on the last sheet, in pencil: the sun disc, a number, an hour. Puerta. `vasco_look_charts`
