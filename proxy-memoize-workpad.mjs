import memoize from 'proxy-memoize'

const state = {
  objects: {
    object1: {
      rank: 1,
      color: 'red'
    },
    object2: {
      rank: 4,
      color: 'green'
    },
    object3: {
      rank: 2,
      color: 'yellow'
    },
    object4: {
      rank: 3,
      color: 'blue'
    }
  },
  toggler: true
}

// memoize sorter such that it does not need to re-run
// unless the rank of one of the selected objects has changed.

let objectList = ['object4', 'object3', 'object1']

let selectObjectSorterWithOnlyState = memoize(({state}) => {
  console.log('generating sorter')
  return (objA, objB) => { console.log('running sorter'); return state.objects[objA].rank - state.objects[objB].rank; }
});

let sortedWithOnlyStateMemoized = [...objectList].sort(selectObjectSorterWithOnlyState({state}))
// > generating sorter
// > running sorter
// > running sorter

console.log(sortedWithOnlyStateMemoized)
// > [ 'object1', 'object3', 'object4' ]

let _sortedAgainWithOnlyStateMemoized = [...objectList].sort(selectObjectSorterWithOnlyState({state}))
// > running sorter
// > running sorter

// So that doesn't meaningfully impact the sort at all
// What if the sorter is memoized as well?

let selectSortResultWithStateAndInputsMemoized = memoize(({state, valA, valB}) => {
  console.log('running sorter')
  return state.objects[valA].rank - state.objects[valB].rank;
}, 500)

let sortedWithStateAndInputsMemoized = [...objectList].sort((valA,valB) => selectSortResultWithStateAndInputsMemoized({state, valA, valB }))
// > running sorter
// > running sorter

let _sortedAgainWithStateAndInputsMemoized = [...objectList].sort((valA, valB) => selectSortResultWithStateAndInputsMemoized({state, valA, valB}))
// > running sorter
// > running sorter

// So, weirdly, that didn't work at all. Even though we're providing the same inputs -- the same state, valA, and valB -- 
// the memoization did not stop the sort evaluator function from being called.

// Let's try trusting the magic a bit more.
let runcount = 0
let selectSorted = memoize(({state}) => {
  console.log('running sorter ', runcount++)
  return [...state.objectList].sort((valA, valB) => { console.log('running sort pass'); return state.objects[valA].rank - state.objects[valB].rank; }) 
})

console.log(selectSorted({state}))
// > running sort pass
// > running sort pass
// > running sorter 0
// > (3) ["object1", "object3", "object4"]
console.log(selectSorted({state}))
// > (3) ["object1", "object3", "object4"]

// ok, so that avoided the whole second sort. what if we change one of the objects and re-run?
state = Object.assign({},state, {
  objects: {
    ...state.objects,
    object3: {
      ...state.object3,
      rank: 4
    }
  }
})
console.log(selectSorted({state}))
// > running sorter 1
// > running sort pass
// > running sort pass
// > running sort pass
// > running sort pass
// > (3) ["object1", "object4", "object3"]

// great -- as expected, the sort re-ran. interestingly, but not relatedly, it took two more passes with the items in the new order.
// what if we change one of the other objects but not ones we're referring to?
state = Object.assign({},state, {
  objects: {
    ...state.objects,
    object2: {
      ...state.object2,
      rank: 2
    }
  }
})
console.log(selectSorted({state}))
// > (3) ["object1", "object4", "object3"]

// cool -- sort did not re-run. what if we change one of the values in one of the objects we're interested in, but not rank?
state = Object.assign({},state, {
  objects: {
    ...state.objects,
    object3: {
      ...state.objects.object3,
      color: 'mauve'
    }
  }
})

console.log(selectSorted({state}))
// > (3) ["object1", "object4", "object3"]

// okay, same -- no new sort. so we can save the running of the sort algorithm if the items to sort have not changed.
// but if one of the values changes, then the sort has to re-run in full.
// what if the list changes?

// let's leave the values the same but the array new.
state = Object.assign({},state, {
  objectList: ['object1', 'object3', 'object4']
})

console.log(selectSorted({state}))
// > running sorter 2
// > running sort pass
// > running sort pass
// > running sort pass
// > running sort pass
// > (3) ["object1", "object4", "object3"]

// ok, so that triggered a complete re-sort.
// presumably a new item in the list will do the same thing.


state = Object.assign({},state, {
  objectList: ['object1', 'object3', 'object4', 'object2']
})

console.log(selectSorted({state}))
// > running sort pass 
// > running sort pass 
// > running sort pass 
// > running sort pass 
// > running sort pass 
// > running sort pass 
// > (4) ["object1", "object2", "object4", "object3"]

// yep.
// so it's weird though that we can't cache the inner function of the sorter.
// let's try one more time.

let innerSort = 0

const selectSortComparison = memoize(({state, objectA, objectB}) => { 
  console.log('running inner sorter ', innerSort++)
  return state.objects[objectA].rank - state.objects[objectB].rank
})


console.log(selectSortComparison({state, objectA: 'object1', objectB: 'object2'}))
// > running inner sorter 0
// > -1
console.log(selectSortComparison({state, objectA: 'object1', objectB: 'object2'}))
// > -1

// so no, that does actually work. so let's go a step further..

let outerSort = 0

const selectSortedObjects = memoize(({state}) => {
  console.log('running outer sorter ', outerSort++)
  return [...state.objectList].sort((objectA, objectB) => selectSortComparison({state, objectA, objectB}))
})

console.log(selectSortedObjects({state}));
// > running outer sorter 0
// > running inner sorter 0
// > running inner sorter 1
// > running inner sorter 2
// > running inner sorter 3
// > running inner sorter 4
// (4) ["object1", "object2", "object4", "object3"]

console.log(selectSortedObjects({state}));
// (4) ["object1", "object2", "object4", "object3"]

// okay, so that did work because we're using the cached value of the sorter function. but what happens if we remove an object from the list?
state = Object.assign({},state, {
  objectList: ['object1', 'object3', 'object4']
})

console.log(selectSortedObjects({state}));
// > running outer sorter 1
// > running inner sorter 5
// > running inner sorter 6
// > running inner sorter 7
// > (3) ["object1", "object4", "object3"]

// so it seems to have run again. what if we restore the original values in state?
state = Object.assign({},state, {
  objectList: [...state.objectList, 'object2']
})

console.log(selectSortedObjects({state}));
// > running outer sorter 2
// > running inner sorter 8
// > running inner sorter 9
// > running inner sorter 10
// > running inner sorter 11
// > running inner sorter 12
// > (4) ["object1", "object2", "object4", "object3"]

// so even though the inputs to the inner sort function are the same by value, it's still not saving us any runs.
// let's try extending the 'size' of the sort function.
innerSort = 0
outerSort = 0
const selectSortComparison2 = memoize(({state, objectA, objectB}) => { 
  console.log('running inner sorter ', innerSort++)
  return state.objects[objectA].rank - state.objects[objectB].rank
}, { size: 500 })

const selectSortedObjects2 = memoize(({state}) => {
  console.log('running outer sorter ', outerSort++)
  return [...state.objectList].sort((objectA, objectB) => selectSortComparison2({state, objectA, objectB}))
})

console.log(selectSortedObjects2({state}));
// > running outer sorter 0
// > running inner sorter 0
// > running inner sorter 1
// > running inner sorter 2
// > running inner sorter 3
// > running inner sorter 4
// (4) ["object1", "object2", "object4", "object3"]

console.log(selectSortedObjects2({state}));
// (4) ["object1", "object2", "object4", "object3"]

// No change. Let's continue:
console.log(selectSortedObjects2({state}));
state = Object.assign({},state, {
  objectList: ['object1', 'object3', 'object4']
})

console.log(selectSortedObjects2({state}));
// > running outer sorter 1
// > running inner sorter 5
// > running inner sorter 6
// > running inner sorter 7
// > (3) ["object1", "object4", "object3"]

// oof. So it's again 3 comparisons -- even though the input objects haven't changed.
// maybe the problem isn't the state object but the object object that we're passing into the sort.
// let's try again. but first for completion's sake let's restore the object to its previous state, as
// we did before, and see if the result is still 3 runs:
state = Object.assign({},state, {
  objectList: [...state.objectList, 'object2']
})

console.log(selectSortedObjects2({state}));
// > running outer sorter 2
// > running inner sorter 8
// > running inner sorter 9
// > running inner sorter 10
// > running inner sorter 11
// > running inner sorter 12
// > (4) ["object1", "object2", "object4", "object3"]

// ok -- so setting the size parameter on the inner sort didn't change a damn thing.
// let's try changing the inner sort parameters to point directly to the objects in state.

innerSort = 0
outerSort = 0
const selectSortComparison3 = memoize(({objectA, objectB}) => { 
  console.log('running inner sorter ', innerSort++)
  return objectA.rank - objectB.rank
}, { size: 500 })

const selectSortedObjects3 = memoize(({state}) => {
  console.log('running outer sorter ', outerSort++)
  return [...state.objectList].sort((objectA, objectB) => selectSortComparison3({objectA: state.objects[objectA], objectB: state.objects[objectB]}))
})

console.log(selectSortedObjects3({state}));
console.log(selectSortedObjects3({state}));

// > running outer sorter 0
// > running inner sorter 0
// > running inner sorter 1
// > running inner sorter 2
// > running inner sorter 3
// > running inner sorter 4
// > (4) ["object1", "object2", "object4", "object3"]
// > (4) ["object1", "object2", "object4", "object3"]

// So, as expected: it takes 5 runs through the sort the array, and the outer memoization proxy prevents from having to run again with the state completely unchanged.
// Now let's retry our mutations.

state = Object.assign({},state, {
  objectList: ['object1', 'object3', 'object4']
})

console.log(selectSortedObjects3({state}));
// > running outer sorter 1
// > (3) ["object1", "object4", "object3"]

// Aha! Brilliant. Now the sorter is re-run because the state has changed, but the inner comparators don't need to re-run at all.
// What if we now extend the array?
state = Object.assign({},state, {
  objectList: [...state.objectList, 'object2']
})

console.log(selectSortedObjects3({state}));
  
// > running outer sorter  
// >> (4) ["object1", "object2", "object4", "object3"]

// Hell yes. Now even if we extend the array, it doesn't have to re-run the comparisons. It's actually caching based on the objects' inner values. Wow.

// OK, so let's try some of the object mutation and see how the results change.
state = Object.assign({},state, {
  objects: {
    ...state.objects,
    object2: {
      ...state.object2,
      rank: 5
    }
  }
})
console.log(selectSortedObjects3({state}))
// > running outer sorter 3
// > running inner sorter 5
// > running inner sorter 6
// > (4) ["object1", "object4", "object3", "object2"]

// OK -- so this time it ran the inner sorter twice, instead of five times.

// OK, so now what happens if we change the toggle on the state? None of our objects are involved.
state = Object.assign({},state, {
  toggler: false
})
console.log(selectSortedObjects3({state}))
// > (4) ["object1", "object4", "object3", "object2"]

// OK -- so that's interesting. It's safe to pass the whole state; as long as you're not touching part of it, it won't re-render. So why did passing objectNames
// not work before? Because they were strings. **The memoization only works by reference**?

// Wait, let's duplicate that early one more precisely.
//
// let selectSortResultWithStateAndInputsMemoized = memoize(({state, valA, valB}) => {
//   console.log('running sorter')
//   return state.objects[valA].rank - state.objects[valB].rank;
// }, 500)

innerSort = 0
outerSort = 0
const selectSortComparison4 = memoize(({state, objectIdA, objectIdB}) => { 
  console.log('running inner sorter ', innerSort++)
  return state.objects[objectIdA].rank - state.objects[objectIdB].rank
}, { size: 500 })

const selectSortedObjects4 = memoize(({state}) => {
  console.log('running outer sorter ', outerSort++)
  return [...state.objectList].sort((objectA, objectB) => selectSortComparison3({objectA: state.objects[objectA], objectB: state.objects[objectB]}))
})

