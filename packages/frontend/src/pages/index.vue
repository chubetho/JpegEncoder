<script setup lang="ts">
import { type Node as BackendNode, computeTree } from 'backend'
import type { Node } from 'treefun2'
import { treeToDiagram } from 'treefun2'

const text = ref('aabbccccdeeeeef')

function render() {
  const element = document.querySelector('#element') as HTMLElement
  if (!element)
    return

  const root = computeTree(text.value)
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
}

function parse(node: BackendNode): Node {
  const result = { label: node.symbol ?? `(${node.count})`, children: [] as Node[] }
  node.left && result.children.push(parse(node.left))
  node.right && result.children.push(parse(node.right))

  return result
}

onMounted(() => render())
</script>

<template>
  <div class="flex justify-around">
    <div class="basis-1/3 border p-6 space-y-10">
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

    <div class="flex-center basis-2/3 border p-6">
      <div id="element" />
    </div>
  </div>
</template>
