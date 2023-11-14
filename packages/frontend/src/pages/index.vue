<script setup lang="ts">
import { type Node as BackendNode, computeAntiPatternTree, computeRightTree, computeTree } from 'backend'
import type { Node } from 'treefun2'
import { treeToDiagram } from 'treefun2'

const text = ref('AAAABBBBCCCCCCDDDDDDEEEEEEEFFFFFFFFF')

function render() {
  const ids = ['#element1', '#element2', '#element3'] as const
  ids.forEach((id) => {
    const element = document.querySelector(id) as HTMLElement
    if (!element)
      return

    const root = (() => {
      switch (id) {
        case '#element1': return computeTree(text.value)
        case '#element2': return computeRightTree(text.value)
        case '#element3': return computeAntiPatternTree(text.value)
      }
    })()
    const tree = [parse(root)]

    element.querySelector('svg')?.remove()

    treeToDiagram(document, element, tree, {
      width: 300,
      height: 300,
      labelLineSpacing: 15,
      arrowHeadWidth: 0,
      arrowHeadHeight: 0,
      minimumSiblingGap: 1,
      minimumCousinGap: 1,
      levelsGap: 1,
      cornerRounding: 5,
      minimumDepth: 0,
      minimumBreadth: 0,
    }, 'line {stroke: white;}')
  })
}

function parse(node: BackendNode): Node {
  const result = { label: node.symbol ?? `(${node.count})`, children: [] as Node[] }
  node.left && result.children.push(parse(node.left))
  node.right && result.children.push(parse(node.right))

  return result
}

onMounted(() => render())
// onUpdated(() => render())
</script>

<template>
  <div class="flex justify-around">
    <div class="basis-1/4 border p-6 space-y-10">
      <p class="text-4xl">
        Huffman Tree
      </p>

      <div class="text-left space-y-2">
        <BaseLabel for="text" class="text-xl">
          Text
        </BaseLabel>
        <BaseTextarea id="text" v-model="text" rows="5" />
        <BaseButton @click="render">
          Render
        </BaseButton>
      </div>
    </div>

    <div class="grid grid-cols-3 basis-3/4 gap-5 border p-6 divide-x-2">
      <div class="flex-center flex-col gap-5">
        <p class="text-xl">
          Normal Tree
        </p>
        <div id="element1" />
      </div>
      <div class="flex-center flex-col gap-5">
        <p class="text-xl">
          Right Tree
        </p>
        <div id="element2" />
      </div>
      <div class="flex-center flex-col gap-5">
        <p class="text-xl">
          Antipattern Tree
        </p>
        <div id="element3" />
      </div>
    </div>
  </div>
</template>
