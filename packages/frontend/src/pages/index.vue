<script setup lang="ts">
import { type Node, computeAntiPatternTree, computeLimitLevelTree, computeRightTree, computeTree } from 'backend'

// @ts-expect-error no d.ts
import VueTree from '@ssthouse/vue3-tree-chart'
import '@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css'

interface TreeNode {
  label?: string
  children: TreeNode[]
}

const config = { nodeWidth: 100, nodeHeight: 100, levelHeight: 75 }
const collapseEnabled = false

const text = ref('aaaaassssssssdddddddddddddfffffgghh')

const normalTree = computed(() => ({
  dataset: parse(computeTree(text.value)),
  config,
  collapseEnabled,
}))
const antiTree = computed(() => ({
  dataset: parse(computeAntiPatternTree(text.value)),
  config,
  collapseEnabled,
}))

const limit = ref(2)
const limitTree = computed(() => ({
  dataset: parse(computeLimitLevelTree(text.value, limit.value)),
  config,
  collapseEnabled,
}))
const rightTree = computed(() => ({
  dataset: parse(computeRightTree(text.value)),
  config,
  collapseEnabled,
}))

function parse(node: Node) {
  const result = { label: node.symbol ?? `${node.count}`, children: [] as TreeNode[] }
  node.left && result.children.push(parse(node.left))
  node.right && result.children.push(parse(node.right))

  return result
}

const drag = ref(false)
const style = computed(() => drag.value ? '' : '[&>.dom-container]:!translate-x-400px [&>.vue-tree]:!translate-x-400px [&>.dom-container]:!translate-y-0 [&>.vue-tree]:!translate-y-0')
</script>

<template>
  <div class="p-10 space-y-5">
    <div class="border p-6 space-y-5">
      <p class="text-4xl">
        Huffman Tree
      </p>

      <div class="text-left space-y-5">
        <div>
          <BaseLabel for="text" class="text-xl">
            Text
          </BaseLabel>

          <BaseTextarea id="text" v-model="text" rows="3" />
        </div>

        <div class="flex items-center gap-x-5">
          <BaseLabel for="checkbox" class="text-xl">
            Enable drag
          </BaseLabel>

          <input id="checkbox" v-model="drag" type="checkbox" class="scale-150">
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 grid-rows-2 w-full gap-5">
      <div class="border p-5">
        <p class="text-2xl">
          Normal Tree
        </p>
        <div>
          <VueTree
            v-bind="normalTree"
            class="h-600px w-full"
            :class="style"
          >
            <template #node="{ node }">
              <div
                class="h-10 w-10 flex-center bg-white text-black"
                :class="[Number.isNaN(parseInt(node.label)) ? 'rounded-none' : 'rounded-full']"
              >
                {{ node.label }}
              </div>
            </template>
          </VueTree>
        </div>
      </div>
      <div class="border p-5">
        <p class="text-2xl">
          Anti Pattern Tree
        </p>
        <div>
          <VueTree
            v-bind="antiTree"
            class="h-600px w-full"
            :class="style"
          >
            <template #node="{ node }">
              <div
                class="bg h-10 w-10 flex-center text-black"
                :class="[Number.isNaN(parseInt(node.label)) ? 'rounded-none' : 'rounded-full', node.label === '' ? 'bg-red' : 'bg-white']"
              >
                {{ node.label }}
              </div>
            </template>
          </VueTree>
        </div>
      </div>

      <div class="border p-5">
        <p class="text-2xl">
          Right Tree
        </p>
        <div>
          <VueTree
            v-bind="rightTree"
            class="h-600px w-full"
            :class="style"
          >
            <template #node="{ node }">
              <div
                class="h-10 w-10 flex-center bg-white text-black"
                :class="[Number.isNaN(parseInt(node.label)) ? 'rounded-none' : 'rounded-full']"
              >
                {{ node.label }}
              </div>
            </template>
          </VueTree>
        </div>
      </div>

      <div class="border p-5">
        <div class="text-2xl">
          Limit Tree
          <input v-model="limit" type="number" class="w-15 px-2 text-black">
        </div>
        <div>
          <VueTree
            v-bind="limitTree"
            class="h-600px w-full"
            :class="style"
          >
            <template #node="{ node }">
              <div
                class="h-10 w-10 flex-center bg-white text-black"
                :class="[Number.isNaN(parseInt(node.label)) ? 'rounded-none' : 'rounded-full']"
              >
                {{ node.label }}
              </div>
            </template>
          </VueTree>
        </div>
      </div>
    </div>
  </div>
</template>
