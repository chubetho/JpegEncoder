<script setup lang="ts">
import { buildTree } from 'backend'

// @ts-expect-error no d.ts
import VueTree from '@ssthouse/vue3-tree-chart'
import '@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css'

interface TreeNode { label?: string; children: TreeNode[] }

const input = ref('abccccccddddddddddeeeeeeeeeeeeeeeeeeeeffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
const output = ref('')
const maxLength = ref(5)
const anti = ref(false)
const tree = computed(() => ({
  dataset: parse(buildTree(input.value, maxLength.value, anti.value)),
  config: { nodeWidth: 80, nodeHeight: 120, levelHeight: 80 },
  collapseEnabled: false,
}))

function parse(node?: ReturnType<typeof buildTree>): TreeNode {
  if (!node)
    return { children: [] }

  if (!node.left && !node.right)
    return { label: node.symbol, children: [] }

  const leftTree = parse(node.left)
  const rightTree = parse(node.right)
  return {
    children: [leftTree, rightTree],
  }
}

const drag = ref(true)
const style = computed(() => drag.value ? '' : '[&>.dom-container]:!translate-x-900px [&>.vue-tree]:!translate-x-900px [&>.dom-container]:!translate-y-0px [&>.vue-tree]:!translate-y-0px')
</script>

<template>
  <div class="space-y-3">
    <div class="border p-6 space-y-9">
      <p class="text-4xl">
        Huffman Tree
      </p>

      <div class="grid grid-cols-2 gap-9">
        <div class="space-y-3">
          <div class="space-y-3">
            <BaseLabel for="input" class="text-xl">
              Input
            </BaseLabel>

            <BaseTextarea id="input" v-model="input" rows="5" />
          </div>

          <div class="flex items-center gap-6">
            <div class="w-100px">
              <BaseLabel for="length" class="text-xl">
                Level
              </BaseLabel>

              <BaseInput id="length" v-model="maxLength" class="text-xl" type="number" />
            </div>

            <div class="flex items-center gap-x-5">
              <BaseLabel for="anti" class="text-xl">
                Enable anti
              </BaseLabel>

              <input id="anti" v-model="anti" type="checkbox" class="scale-150">
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <BaseLabel for="text" class="text-xl">
            Output
          </BaseLabel>

          <BaseTextarea id="text" v-model="output" rows="5" />
        </div>
      </div>
    </div>

    <div class="w-full">
      <div class="relative border p-3">
        <p class="text-2xl">
          Normal Tree
        </p>

        <div class="absolute left-3 top-3">
          <div class="flex items-center gap-x-5">
            <BaseLabel for="checkbox" class="text-xl">
              Enable drag
            </BaseLabel>

            <input id="checkbox" v-model="drag" type="checkbox" class="scale-150">
          </div>
        </div>

        <div>
          <VueTree
            v-bind="tree"
            class="h-700px w-full"
            :class="style"
          >
            <template #node="{ node }">
              <div
                class="h-8 w-8 flex-center select-none bg-white text-black"
                :class="node.label ? 'rounded-none' : 'rounded-full'"
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
