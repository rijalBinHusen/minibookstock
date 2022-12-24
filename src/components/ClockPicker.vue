<template>

</template>

<script setup>

const clockValue = (nowHours) => {
    const start = nowHours < 4 ? 2 :3;
    const arr = [];
    for (let i=0; i < val; i++) {
        for (let j=0; j < 59; j++) {
            arr.push(`${i}:${j === 0 ? `00` : 15*j}`);
        }
    }
}

</script>