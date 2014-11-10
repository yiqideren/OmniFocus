app = Application('OmniFocus')
app.includeStandardAdditions = true
doc = app.defaultDocument

function selected() {
	return app.windows[0].content.selectedTrees.value()
}

function searchString(term) {
	return new RegExp(term, 'i')
}

function allTasks() {
	return doc.flattenedTasks.whose({completed: false})()
}

function allProjects() {
	return doc.flattenedProjects.whose({completed: false})()
}

function tasksWithContext(context) {
	tasks = []
	allTasks().forEach(function(task, index) {
		if (task.context() != null) {
			if (searchString(context).test(task.context().name())) {
				tasks.push(task)
				console.log(task.name())
				console.log(tasks.length)
			}
		}
	})
	return tasks
}

function projectsWithName(name) {
	projects = []
	allProjects().forEach(function(project, index) {
		if (project.container() != null) {
			if (searchString(name).test(project.name())) {
				projects.push(project)
				console.log(project.name())
				console.log(projects.length)
			}
		}
	})
	return projects
}

function tasksWithName(name) {
	tasks = []
	allTasks().forEach(function(task, index) {
		if (searchString(name).test(task.name())) {
			tasks.push(task)
			console.log(task.name())
			console.log(tasks.length)
		}
	})
	return tasks
}

function allWithName(searchTerm) {
	tasks = tasksWithName(searchTerm).concat(tasksWithContext(searchTerm)).concat(projectsWithName(searchTerm))
	return tasks
}

function setDefer(tasks, date) {
	tasks.forEach(function (task) {
		date.getHours() === 0 ? date.setHours(8) : date
		console.log(date)
		task.deferDate = date
	})
}

function setDue(tasks, date) {
	tasks.forEach(function (task) {
		date.getHours() === 0 ? date.setHours(4) : date
		console.log(date)
		task.dueDate = date
	})
}

function setContext(tasks, place) {
	newContext = doc.flattenedContexts.whose({name: place})[0]
	tasks.forEach(function(task) {
		task.context = newContext
		console.log(task.name() + "'s context is now set to " + newContext.name() + '.')
	})
}

function getContext(context) {
	return doc.flattenedContexts.whose({name: context})[0]
}

function getProject(project) {
	return doc.flattenedProjects.whose({name: project})[0]
}

function inboxTasks() {
	return doc.inboxTasks()
}

function newTask(text, place, deferDate, dueDate) {
	return app.Task({name: text, context: getContext(place), deferDate: null || deferDate, dueDate: null || dueDate})
}

function pushTask(task, project) {
	getProject(project).tasks.push(task)
}

function updateInboxTasks(context, project, deferDate, dueDate) {
	newContext = getContext(context)
	newProject = getProject(project)
	inboxTasks().forEach(function(task) {
		task.context = newContext
		task.deferDate = deferDate
		task.dueDate = dueDate
		pushTask(task, newProject)
	})
}

function prefixTasksWith(tasks,text) {
	tasks.forEach(function(task) {
		task.name = text + ' ' + task.name()
	})
}
