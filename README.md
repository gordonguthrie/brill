# Brill

## Introduction

Brill is a GUI/editor for the Sonic PI. It is designed to make it easy and intuitive to write songs.

It is named after, and dedicated to, the Brill Building in New York where many of my heroines worked and recorded.

## Design Criterion And Constraints

A song is ultimately a data structure - a series of notes, of defined pitch and duration, played with an intesity at a point in time.

These notes are assembled into phrases; which constitute hooks, melodies, bridges, verses, choruses and other building blocks. These phrases are repeated, either exactly, or in variation, during the song.

These phrases are not entirely random - they are divided betweeen melodic phrases which vary in pitch and rhythmic ones (which may or may not vary in pitch). Sounds are grouped into 'instruments' which sound similar and have constraints on range and express emphasis differently.

Brill should obiviate the need for the songwriter to write any code - ***except*** for instruments - your sound should come from your instruments, which you build.

Instruments are designed to be easy to make - they are deliberately constrained in their interface - pitch, duration, volume and two arbitrary **intensities**. If you need more expressiveness, make variants on your instruments.

Keeping the interface tight makes it possible to situtate them in a graphic editor easily and avoid the hell that is most open source audio packages, walls of knobs that look like a nuclear power station.

Brill is designed to make it easy to build these phrases (and variants on them) and then stitch them together to make a song.

Brill is an analogue editor, timings are not required to be exact, or strict (and jitter can be applied), notes are not required to be pitch perfect.

A three minute song, at 120 BPM in 4/4 time is about 90 bars, this is a design constraint - representing 120 bars or so on a single editor page.

Song writing is a creative and collaborative process - so Brill is designed to make it easy to riff and jam, to build hooks and beats and riffs and so share these bits and pieces.

The editor emits a data structure to disk - a data structure which is then naively compiled to Ruby code for Sonic PI.

This data structure is a first class object - it is designed with some properties in mind:
* it should be stored in `git` - each individual iteration, experiment, tweak should be captured and backed off, so that the process of song moulding can be safely iterative, with false approaches, dead ends, back tracking and experimention
* it should be human readable so that git tools work - I can see what has changed between Version `i` and `j` (or between variants) by using `diff`
* it should make collaboration easy, so somebody else can take my fragments, change, edit and arrange them and suggest a new version via a normal change request process

Brill also treats Sonic Pi and the Rapsberry Pi with respect - the Sonic Pi/Pie(c) Combo is an instrument/orchestra in their own right - and songs written with Brill are song's for this orchestra - not songs in general - but Brill is designed to enable the songwriter to find **their** sound.

## Photo Credit

Photo of Brill Building Emily Mathews

https://www.flickr.com/photos/eamathe/14517606218/in/photolist-PTFCn6-2cE9SHG-qaggKV-jNRWPX-o7Swxu-jNRS3T-jNTaGM-jNTVGm-jNTwVi-jNT8Uk-jNTvzK-jNTjxe-jNUnec-jNVEsQ-jNSVwx-jNSEG4-jNUppe-jNUwJq-jNVv5m-jNSMeH-jNRNEa-jNV4CE-jNSY48-jNV9d1-jNSazr-jNTikc-jNW23N-jNU6bv-jNVLSU-jNSvTc-jNTVjr-jNTSkR-jNSgec-jNSSZv-jNUsia-jNVeUG-jNVGKW-jNSCNe