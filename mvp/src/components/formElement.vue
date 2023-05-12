<template>
    <section>
        <h4>This is a Flex-Grow</h4>
        <h5>A,B,C and F are flex-grow:1 . D and E are flex-grow:2 .</h5>
        <div id="content">
            <div class="small" style="background-color:red;">A</div>
            <div class="small" style="background-color:lightblue;">B</div>
            <div class="small" style="background-color:yellow;">C</div>
            <div class="double" style="background-color:brown;">D</div>
            <div class="double" style="background-color:lightgreen;">E</div>
            <div class="small" style="background-color:brown;">F</div>
        </div>        
    </section>


  
</template>

<script setup>

</script>

<style scoped>

section {
}

#content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  /* flex-flow: row wrap;
  align-items: stretch; */
    height: 100%;
    min-height: 100%;
}

.small {
  flex: 1;
  border: 3px solid rgba(0, 0, 0, 0.2);
}

.double {
  flex: 2;
  border: 3px solid rgba(0, 0, 0, 0.2);
}


</style>