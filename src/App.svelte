<script>
  import Rive from "./Rive.svelte";

  let scrub, scrollY = 0;
  let duration = 1;

  $: {
    const totalScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    scrub = duration * (scrollY / totalScroll).toFixed(4);
  }

</script>


<main>
  <section class="scrub">
    <Rive fileName="https://public.rive.app/community/runtime-files/186-341-flame-and-spark.riv"
          animations={["Untitled 1"]}
          width={window.innerWidth/2} height={window.innerWidth/2}
          {scrub} startTime={0.25}
    />

  </section>
  <section class="normal">
    <Rive fileName="https://public.rive.app/community/runtime-files/186-341-flame-and-spark.riv"
          animations={["Untitled 1"]}
          width={window.innerWidth/2} height={window.innerWidth/2}
          playRate={0.5}
    />

  </section>
</main>


<svelte:window bind:scrollY={scrollY} />
<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #222;
        color: #666666;
    }

    main {
        height: 400vh;
        overflow: auto;
    }

    section {
        position: fixed;
        top: 0;
        left: 0;
    }

    .normal {
        left: 50%;
    }
</style>