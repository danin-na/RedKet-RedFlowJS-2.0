```javascript
function RedFlow (name)
{
	console.log(RedFlow.instance)

	RedFlow.instance
		? (() => { throw new Error("You can have only one instance of RedFlow") })()
		: (RedFlow.instance = this)

	function function1 () { console.log(name, "⚙️ function 1") }
	function function2 () { console.log(name, "⚙️ function 2") }

	return { function1, function2 }
}

const instance1 = RedFlow("instance1")
instance1.function1()

const instance2 = RedFlow("instance2")
instance2.function2()

```