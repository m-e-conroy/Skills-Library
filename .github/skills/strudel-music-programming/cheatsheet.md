# Strudel Quick Reference

> Live coding music with JavaScript - https://strudel.cc/

## Mini-Notation Syntax

```
space     → sequence: "bd sd hh"
[]        → subdivide: "bd [hh hh]"  
<>        → alternate: "<bd sd>" (one per cycle)
*n        → speed up: "bd*4"
/n        → slow down: "[a b c d]/2"
~ or -    → rest: "bd ~ sd ~"
,         → parallel: "bd, hh*4"
:n        → sample num: "hh:2"
@n        → elongate: "c@3 e"
!n        → replicate: "c!3"
?         → 50% chance: "bd?"
|         → random pick: "a | b | c"
(b,s)     → euclidean: "bd(3,8)"
(b,s,o)   → with offset: "bd(3,8,2)"
```

## Core Functions

```javascript
// Sounds
sound("bd hh sd hh")     // or s("bd hh")
sound("casio:2")         // sample number
.bank("RolandTR909")     // drum machine

// Notes  
note("c4 e4 g4")         // letters
note("60 64 67")         // MIDI numbers
n("0 2 4").scale("C:minor")  // scale degrees

// Tempo
setcpm(30)               // cycles per minute (default)
.fast(2) / .slow(2)      // speed modifiers
```

## Effects

```javascript
// Filters
.lpf(800)                // low-pass
.hpf(200)                // high-pass  
.vowel("<a e i o>")      // vowel filter

// Dynamics
.gain(.5)                // volume
.adsr(".1:.1:.5:.2")     // envelope

// Space
.room(.5)                // reverb
.delay(".5:.25:.6")      // amt:time:feedback
.pan("0 1")              // L/R

// Other
.distort(2)              // distortion
.crush(4)                // bitcrush
.speed("<1 -1>")         // playback speed
```

## Signals

```javascript
sine / saw / tri / square    // waveforms
rand / perlin                // random
.lpf(sine.range(200, 2000))  // set range
.lpf(sine.slow(4))           // change speed
```

## Patterns

```javascript
// Parallel patterns
$: sound("bd*4")
$: note("c e g").sound("piano")
_$: sound("hh*8")        // muted

// Transforms
.rev()                   // reverse
.every(4, rev)           // every 4 cycles
.sometimes(x => x.fast(2))
.jux(rev)                // stereo split
```

## Common Sounds

**Drums**: `bd sd hh oh cp rim lt mt ht cr rd`  
**Banks**: `RolandTR909 RolandTR808 RolandTR707`  
**Synths**: `sawtooth square triangle sine`  
**GM**: `piano gm_acoustic_bass gm_pad_warm`

## Example Patterns

```javascript
// Basic beat
sound("bd*4, [~ sd]*2, hh*8").bank("RolandTR909")

// Melodic
n("<0 2 4 6>*2").scale("C:minor").sound("piano")
  .room(.3).lpf(sine.range(400,2000))

// Euclidean
sound("bd(3,8), hh(5,8), cp(2,8)")
```

## Keyboard (REPL)
- `Ctrl+Enter` Play/Update
- `Ctrl+.` Stop
