---
title: Week 4 Exercises
---

This week will consist of a single interactive simulation: a jumping dot game,
where you'll apply what you've learned about RxJS to handle user input,
state updates, randomness, and rendering.

## Jumping Dot

In this exercise, you'll build a simple physics-based game where a dot jumps
when the spacebar is pressed. The jump is affected by gravity and randomized
strength. You'll use observable streams to manage user input, physics updates,
and game state in a reactive way.

We’ve provided a skeleton project and several utility functions to help you
focus on building the core RxJS pipelines.

### Provided code

We already helper functions to produce pseudo-random numbers (via a hash).

The random x and y coordinates are in the range -1 to 1. There
is a helper function `scale` which will help you with this.
This function takes in a hashed value using `hash` and scales it
to the range [-1, 1].
