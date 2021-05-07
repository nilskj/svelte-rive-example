<script>
  import { Canvas, Layer, t } from "svelte-canvas";
  import { loadRiveFile } from "./lib/loadRiveFile";

  export let fileName, animations = [];
  export let width = 500, height = 500;
  export let scrub, startTime = 0;
  export let playRate = 1;

  let rive, file, artboard, renderer, lastTime, storedContext, animationInstances = [];

  //load a rive file async, let us await this promise and then render it!
  const loadAnimation = loadRiveFile(fileName).then(({ rive: riveInstance, file: fileInstance }) => {
    rive = riveInstance;
    file = fileInstance;
  });

  //setup is run on init of canvas, let's set up our rive renderer and fetch all animation instances
  const setup = ({ context }) => {
    storedContext = context;
    artboard = file.defaultArtboard();
    renderer = new rive.CanvasRenderer(context);

    animations.forEach(((animationName) => {
      animationInstances.push(new rive.LinearAnimationInstance(artboard.animationByName(animationName)));
    }));

    artboard.advance(0);
  };

  // for scrubbing to work we use an empty render function,
  // we then implicitly clear the canvas before drawing and set autoclear = false on the Canvas
  const redraw = (context) => {
    context.clearRect(0, 0, width, height);
    context.save();
    renderer.align(rive.Fit.contain, rive.Alignment.center, {
      minX: 0,
      minY: 0,
      maxX: width,
      maxY: height
    }, artboard.bounds);
    artboard.draw(renderer);
    context.restore();
  };

  //if we scrub check that we have initialized the context
  $: if (typeof (scrub) != "undefined" && storedContext) {

    //this animation had a different startTime, let's use that
    animationInstances.forEach((instance) => {
      instance.time = startTime;
      instance.advance(scrub);
      instance.apply(artboard, 1.0);
    });
    artboard.time = startTime;
    artboard.advance(scrub);

    redraw(storedContext);
  }

  //play all selected animations normally
  $: render = $t && (({ context, width, height }) => {

    if (!lastTime) {
      lastTime = $t;
    }
    const elapsedTime = ($t - lastTime) / 1000;
    lastTime = $t;

    //this mixes all specified animations when playing.
    const advanceRate = elapsedTime * playRate;
    animationInstances.forEach((instance) => {
      instance.advance(advanceRate);
      instance.apply(artboard, 1.0);
    });
    artboard.advance(advanceRate);

    redraw(context);
  });
</script>

<Canvas {width} {height} autoclear={false}>
  {#await loadAnimation then _}
    <!--if scrub just assign an empty function since we don't want it to play-->
    <Layer {setup} render={typeof(scrub) != "undefined" ? () => {} : render} />
  {/await}
</Canvas>

