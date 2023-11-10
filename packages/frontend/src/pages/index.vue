<script setup lang="ts">
import { computeRightTree } from 'backend'
import type { Node } from 'treefun2'
import { treeToDiagram } from 'treefun2'

const root = computeRightTree('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit reiciendis perspiciatis expedita nemo a libero, quas in maiores placeat. Dolore quam ipsa iure fugiat veniam? Blanditiis magni eveniet minus nesciunt ea corrupti optio rerum obcaecati distinctio maxime deleniti, quo molestiae unde est, tempore ad labore dolorum cum tempora consectetur quia incidunt facilis. Fugiat est magnam fuga cumque, architecto pariatur asperiores ad qui similique, cum tenetur laboriosam sed placeat ullam, omnis nulla. Tenetur rerum molestiae quod esse labore consequatur laudantium officiis aliquam. Consequatur veritatis saepe nisi, unde voluptatibus at sequi adipisci. Maxime officiis exercitationem id aliquam ullam iusto fugiat autem laudantium?')
const tree = [parse(root)]

function parse(node: typeof root): Node {
  const result = { label: node.symbol ?? '', children: [] as Node[] }
  node.left && result.children.push(parse(node.left))
  node.right && result.children.push(parse(node.right))

  return result
}

onMounted(() => {
  const element = document.querySelector('#element') as HTMLElement
  if (!element)
    return

  treeToDiagram(document, element, tree, {
    width: 500,
    height: 500,
    labelLineSpacing: 15,
    arrowHeadWidth: 0,
    arrowHeadHeight: 0,
    minimumSiblingGap: 1,
    minimumCousinGap: 1,
    levelsGap: 1,
    cornerRounding: 4,
    minimumDepth: 0,
    minimumBreadth: 0,
  }, 'line {stroke: white;}')
})
</script>

<template>
  <div class="flex-center">
    <div id="element" />
  </div>
</template>
