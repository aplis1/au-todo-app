define('app',['exports', './models/todo', './services/inmemory-todo-promise-service'], function (exports, _todo, _inmemoryTodoPromiseService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);

      this.appName = 'Todo List';
      this.todoTitle = '';
      this.activeFilter = 'all';
      this.todoService = new _inmemoryTodoPromiseService.InMemoryTodoPromiseService();
      this.filterTodos(this.activeFilter);
    }

    App.prototype.filterTodos = function filterTodos(filterCriteria) {
      this.activeFilter = filterCriteria;
      this.todos = this.todoService.filterTodosSync(this.activeFilter);
    };

    App.prototype.addTodo = function addTodo() {
      var _this = this;

      this.todoService.addTodo(new _todo.Todo(this.todoTitle, false)).then(function (addedTodo) {
        _this.todoTitle = '';
        console.log(addedTodo);
        _this.todoService.filterTodos(_this.activeFilter).then(function (todos) {
          _this.todos = todos;
        });
      });
    };

    App.prototype.removeTodo = function removeTodo(todo) {
      var _this2 = this;

      this.todoService.deleteTodoById(todo.id).then(function (deletedTodo) {
        console.log(deletedTodo);
        _this2.todoService.filterTodos(_this2.activeFilter).then(function (todos) {
          _this2.todos = todos;
        });
      }).catch(function (error) {
        console.log('ERROR: ' + error);
      });
    };

    App.prototype.updateTodo = function updateTodo(todo) {
      if (todo.editMode) {
        todo.editMode = false;
        this.todoService.updateTodoById(todo.id, todo).then(function (updatedTodo) {
          console.log(updatedTodo);
        });
      } else {
        todo.editMode = true;
      }
    };

    App.prototype.checkIfAllTodosAreCompleted = function checkIfAllTodosAreCompleted() {
      return this.todos.every(function (todo) {
        return todo.completed;
      });
    };

    App.prototype.toggleAllTodos = function toggleAllTodos() {
      var _this3 = this;

      this.todoService.toggleAllTodos().then(function (result) {
        if (result) {
          _this3.filterTodos(_this3.activeFilter);
        }
      });
    };

    App.prototype.completeAllTodos = function completeAllTodos() {
      var _this4 = this;

      this.todoService.completeAllTodos().then(function (result) {
        if (result) {
          _this4.checkIfAllTodosAreCompleted();
          _this4.filterTodos(_this4.activeFilter);
        }
      });
    };

    App.prototype.removeAllTodos = function removeAllTodos() {
      var _this5 = this;

      this.todoService.removeAllTodos().then(function (result) {
        if (result) {
          _this5.filterTodos(_this5.activeFilter);
        }
      });
    };

    App.prototype.removeCompletedTodos = function removeCompletedTodos() {
      var _this6 = this;

      this.todoService.removeCompletedTodos().then(function (result) {
        if (result) {
          _this6.filterTodos(_this6.activeFilter);
        }
      });
    };

    _createClass(App, [{
      key: 'allTodosCount',
      get: function get() {
        return this.todoService.filterTodosSync('all').length;
      }
    }, {
      key: 'activeTodosCount',
      get: function get() {
        return this.todoService.filterTodosSync('active').length;
      }
    }, {
      key: 'completedTodosCount',
      get: function get() {
        return this.todoService.filterTodosSync('completed').length;
      }
    }]);

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot('shell');
    });
  }
});
define('models/todo',['exports', '../utilities/idgenerators'], function (exports, _idgenerators) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Todo = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Todo = exports.Todo = function Todo(title) {
        var completed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, Todo);

        this.id = _idgenerators.IdGenerator.getNextId();
        this.title = title;
        this.completed = completed;
    };
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('services/inmemory-todo-promise-service',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var InMemoryTodoPromiseService = exports.InMemoryTodoPromiseService = function () {
    function InMemoryTodoPromiseService() {
      _classCallCheck(this, InMemoryTodoPromiseService);

      this.todos = [];
      this.latency = 100;
      this.isRequesting = false;
    }

    InMemoryTodoPromiseService.prototype.getAllTodos = function getAllTodos() {
      var _this = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(_this.todos);
          _this.isRequesting = false;
        }, _this.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.getTodoById = function getTodoById(id) {
      var _this2 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          var found = _this2.todos.filter(function (todo) {
            return todo.id === id;
          }).pop();
          resolve(JSON.parse(JSON.stringify(found)));
          _this2.isRequesting = false;
        }, _this2.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.addTodo = function addTodo(todo) {
      var _this3 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          var instance = JSON.parse(JSON.stringify(todo));
          _this3.todos.push(todo);
          _this3.isRequesting = false;
          resolve(instance);
        }, _this3.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.deleteTodoById = function deleteTodoById(id) {
      var _this4 = this;

      this.isRequesting = true;
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          _this4.getTodoById(id).then(function (deletedTodo) {
            throw new Error('Simulating an error');
            _this4.todos = _this4.todos.filter(function (todo) {
              return todo.id !== id;
            });
            _this4.isRequesting = false;
            resolve(deletedTodo);
          }).catch(function (ex) {
            reject(ex);
          });
        }, _this4.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.updateTodoById = function updateTodoById(id) {
      var _this5 = this;

      var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          _this5.getTodoById(id).then(function (updatedTodo) {
            Object.assign(updatedTodo, values);
            _this5.isRequesting = false;
            resolve(updatedTodo);
          });
        }, _this5.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.toggleTodoCompleted = function toggleTodoCompleted(todo) {
      var _this6 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          _this6.updateTodoById(todo.id, { completed: !todo.completed }).then(function (updatedTodo) {
            _this6.isRequesting = false;
            resolve(updatedTodo);
          });
        }, _this6.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.filterTodosSync = function filterTodosSync(filterCriteria) {
      switch (filterCriteria) {
        case 'active':
          return this.todos.filter(function (t) {
            return !t.completed;
          });
        case 'completed':
          return this.todos.filter(function (t) {
            return t.completed;
          });
        case 'all':
        default:
          return this.todos;
      }
    };

    InMemoryTodoPromiseService.prototype.filterTodos = function filterTodos(filterCriteria) {
      var _this7 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          switch (filterCriteria) {
            case 'active':
              resolve(_this7.todos.filter(function (t) {
                return !t.completed;
              }));
              break;
            case 'completed':
              resolve(_this7.todos.filter(function (t) {
                return t.completed;
              }));
              break;
            case 'all':
            default:
              resolve(_this7.todos);
          }
          _this7.isRequesting = false;
        }, _this7.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.toggleAllTodos = function toggleAllTodos() {
      var _this8 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          _this8.todos.forEach(function (t) {
            return t.completed = !t.completed;
          });
          resolve(true);
          _this8.isRequesting = false;
        }, _this8.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.completeAllTodos = function completeAllTodos() {
      var _this9 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          _this9.todos.forEach(function (t) {
            return t.completed = true;
          });
          resolve(true);
          _this9.isRequesting = false;
        }, _this9.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.removeAllTodos = function removeAllTodos() {
      var _this10 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          _this10.todos.splice(0);
          resolve(true);
          _this10.isRequesting = false;
        }, _this10.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.removeCompletedTodos = function removeCompletedTodos() {
      var _this11 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          _this11.todos = _this11.todos.filter(function (todo) {
            return !todo.completed;
          });
          resolve(true);
          _this11.isRequesting = false;
        }, _this11.latency);
      });
    };

    return InMemoryTodoPromiseService;
  }();
});
define('services/inmemory-todo-service',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var InMemoryTodoService = exports.InMemoryTodoService = function () {
    function InMemoryTodoService() {
      _classCallCheck(this, InMemoryTodoService);

      this.todos = [];
    }

    InMemoryTodoService.prototype.getAllTodos = function getAllTodos() {
      return this.todos;
    };

    InMemoryTodoService.prototype.getTodoById = function getTodoById(id) {
      return this.todos.filter(function (todo) {
        return todo.id === id;
      }).pop();
    };

    InMemoryTodoService.prototype.addTodo = function addTodo(todo) {
      this.todos.push(todo);
      return this;
    };

    InMemoryTodoService.prototype.deleteTodoById = function deleteTodoById(id) {
      this.todos = this.todos.filter(function (todo) {
        return todo.id !== id;
      });
      return this;
    };

    InMemoryTodoService.prototype.updateTodoById = function updateTodoById(id) {
      var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var todo = this.getTodoById(id);
      if (!todo) {
        return null;
      }
      Object.assign(todo, values);
      return todo;
    };

    InMemoryTodoService.prototype.filterTodos = function filterTodos(filterCriteria) {
      switch (filterCriteria) {
        case 'active':
          return this.todos.filter(function (t) {
            return !t.completed;
          });
        case 'completed':
          return this.todos.filter(function (t) {
            return t.completed;
          });
        case 'all':
        default:
          return this.todos;
      }
    };

    InMemoryTodoService.prototype.toggleAllTodos = function toggleAllTodos() {
      this.todos.forEach(function (t) {
        return t.completed = !t.completed;
      });
    };

    InMemoryTodoService.prototype.completeAllTodos = function completeAllTodos() {
      this.todos.forEach(function (t) {
        return t.completed = true;
      });
    };

    InMemoryTodoService.prototype.removeAllTodos = function removeAllTodos() {
      this.todos.splice(0);
    };

    InMemoryTodoService.prototype.removeCompletedTodos = function removeCompletedTodos() {
      this.todos = this.todos.filter(function (todo) {
        return !todo.completed;
      });
    };

    return InMemoryTodoService;
  }();
});
define('utilities/idgenerators',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _IdGenerator = function () {
        function _IdGenerator() {
            _classCallCheck(this, _IdGenerator);

            this.id = 0;
        }

        _IdGenerator.prototype.getNextId = function getNextId() {
            return ++this.id;
        };

        return _IdGenerator;
    }();

    var IdGenerator = exports.IdGenerator = new _IdGenerator();
});
define('resources/attributes/auto-focus',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AutoFocusCustomAttribute = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _dec2, _class;

  var AutoFocusCustomAttribute = exports.AutoFocusCustomAttribute = (_dec = (0, _aureliaFramework.inject)(Element, _aureliaFramework.TaskQueue), _dec2 = (0, _aureliaFramework.customAttribute)('auto-focus', _aureliaFramework.bindingMode.twoWay), _dec(_class = _dec2(_class = function () {
    function AutoFocusCustomAttribute(element, taskQueue) {
      _classCallCheck(this, AutoFocusCustomAttribute);

      this.element = element;
      this.taskQueue = taskQueue;
    }

    AutoFocusCustomAttribute.prototype.giveFocus = function giveFocus() {
      var _this = this;

      this.taskQueue.queueMicroTask(function () {
        _this.element.focus();
      });
    };

    AutoFocusCustomAttribute.prototype.attached = function attached() {
      this.giveFocus();
    };

    AutoFocusCustomAttribute.prototype.valueChanged = function valueChanged(newValue, oldValue) {};

    return AutoFocusCustomAttribute;
  }()) || _class) || _class);
});
define('resources/attributes/keyup-enter',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _class, _temp;

  var KeyupEnterCustomAttribute = exports.KeyupEnterCustomAttribute = (_temp = _class = function () {
    function KeyupEnterCustomAttribute(element) {
      var _this = this;

      _classCallCheck(this, KeyupEnterCustomAttribute);

      this.element = element;

      this.enterPressed = function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
          _this.value();
        }
      };
    }

    KeyupEnterCustomAttribute.prototype.attached = function attached() {
      this.element.addEventListener('keyup', this.enterPressed);
    };

    KeyupEnterCustomAttribute.prototype.detached = function detached() {
      this.element.removeEventListener('keyup', this.enterPressed);
    };

    return KeyupEnterCustomAttribute;
  }(), _class.inject = [Element], _temp);
});
define('resources/attributes/keyup-esc',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _class, _temp;

  var KeyupEnterCustomAttribute = exports.KeyupEnterCustomAttribute = (_temp = _class = function () {
    function KeyupEnterCustomAttribute(element) {
      var _this = this;

      _classCallCheck(this, KeyupEnterCustomAttribute);

      this.element = element;

      this.enterPressed = function (e) {
        var key = e.which || e.keyCode;
        if (key === 27) {
          _this.value();
        }
      };
    }

    KeyupEnterCustomAttribute.prototype.attached = function attached() {
      this.element.addEventListener('keyup', this.enterPressed);
    };

    KeyupEnterCustomAttribute.prototype.detached = function detached() {
      this.element.removeEventListener('keyup', this.enterPressed);
    };

    return KeyupEnterCustomAttribute;
  }(), _class.inject = [Element], _temp);
});
define('shell',['exports', './models/todo', './services/inmemory-todo-promise-service'], function (exports, _todo, _inmemoryTodoPromiseService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Shell = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Shell = exports.Shell = function () {
    function Shell() {
      _classCallCheck(this, Shell);

      this.appName = 'Todo List';
      this.self = this;
      this.todoTitle = '';
      this.todoCompleted = false;
      this.activeFilter = 'all';
      this.todoService = new _inmemoryTodoPromiseService.InMemoryTodoPromiseService();
      this.filterTodos(this.activeFilter);
    }

    Shell.prototype.filterTodos = function filterTodos(filterCriteria) {
      this.activeFilter = filterCriteria;
      this.todos = this.todoService.filterTodosSync(this.activeFilter);
    };

    Shell.prototype.addTodo = function addTodo(todo) {
      var _this = this;

      this.todoService.addTodo(new _todo.Todo(todo.title, todo.completed)).then(function (addedTodo) {
        _this.todoTitle = '';
        todo.title = '';
        console.log(addedTodo);
        _this.todoService.filterTodos(_this.activeFilter).then(function (todos) {
          _this.todos = todos;
        });
      });
    };

    Shell.prototype.removeTodo = function removeTodo(todo) {
      var _this2 = this;

      this.todoService.deleteTodoById(todo.id).then(function (deletedTodo) {
        console.log(deletedTodo);
        _this2.todoService.filterTodos(_this2.activeFilter).then(function (todos) {
          _this2.todos = todos;
        });
      }).catch(function (error) {
        console.log('ERROR: ' + error);
      });
    };

    Shell.prototype.updateTodo = function updateTodo(todo) {
      if (todo.editMode) {
        todo.editMode = false;
        this.todoService.updateTodoById(todo.id, todo);
      } else {
        todo.editMode = true;
      }
    };

    Shell.prototype.checkIfAllTodosAreCompleted = function checkIfAllTodosAreCompleted() {
      return this.todos.every(function (todo) {
        return todo.completed;
      });
    };

    Shell.prototype.toggleAllTodos = function toggleAllTodos() {
      var _this3 = this;

      this.todoService.toggleAllTodos().then(function (result) {
        if (result) {
          _this3.filterTodos(_this3.activeFilter);
        }
      });
    };

    Shell.prototype.completeAllTodos = function completeAllTodos() {
      var _this4 = this;

      this.todoService.completeAllTodos().then(function (result) {
        if (result) {
          _this4.checkIfAllTodosAreCompleted();
          _this4.filterTodos(_this4.activeFilter);
        }
      });
    };

    Shell.prototype.removeAllTodos = function removeAllTodos() {
      var _this5 = this;

      this.todoService.removeAllTodos().then(function (result) {
        if (result) {
          _this5.filterTodos(_this5.activeFilter);
        }
      });
    };

    Shell.prototype.removeCompletedTodos = function removeCompletedTodos() {
      var _this6 = this;

      this.todoService.removeCompletedTodos().then(function (result) {
        if (result) {
          _this6.filterTodos(_this6.activeFilter);
        }
      });
    };

    _createClass(Shell, [{
      key: 'allTodosCount',
      get: function get() {
        return this.todoService.filterTodosSync('all').length;
      }
    }, {
      key: 'activeTodosCount',
      get: function get() {
        return this.todoService.filterTodosSync('active').length;
      }
    }, {
      key: 'completedTodosCount',
      get: function get() {
        return this.todoService.filterTodosSync('completed').length;
      }
    }]);

    return Shell;
  }();
});
define('resources/elements/todo-add',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TodoAdd = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var TodoAdd = exports.TodoAdd = (_dec = (0, _aureliaFramework.customElement)('todo-add'), _dec2 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoway }), _dec3 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoway }), _dec(_class = (_class2 = function TodoAdd() {
    _classCallCheck(this, TodoAdd);

    _initDefineProp(this, 'todoTitle', _descriptor, this);

    _initDefineProp(this, 'todoCompleted', _descriptor2, this);

    _initDefineProp(this, 'addCallback', _descriptor3, this);
  }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'todoTitle', [_dec2], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'todoCompleted', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'addCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('resources/elements/todo-filter',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TodoFilter = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

  var TodoFilter = exports.TodoFilter = (_dec = (0, _aureliaFramework.customElement)('todo-filter'), _dec2 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec3 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec4 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec5 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec(_class = (_class2 = function TodoFilter() {
    _classCallCheck(this, TodoFilter);

    _initDefineProp(this, 'activeFilter', _descriptor, this);

    _initDefineProp(this, 'allTodosCount', _descriptor2, this);

    _initDefineProp(this, 'activeTodosCount', _descriptor3, this);

    _initDefineProp(this, 'completedTodosCount', _descriptor4, this);

    _initDefineProp(this, 'filterTodosCallback', _descriptor5, this);
  }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'activeFilter', [_dec2], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'allTodosCount', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'activeTodosCount', [_dec4], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'completedTodosCount', [_dec5], {
    enumerable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'filterTodosCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('resources/elements/todo-action',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TodoAction = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;

  var TodoAction = exports.TodoAction = (_dec = (0, _aureliaFramework.customElement)('todo-action'), _dec2 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec3 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec(_class = (_class2 = function TodoAction() {
    _classCallCheck(this, TodoAction);

    _initDefineProp(this, 'allTodosCount', _descriptor, this);

    _initDefineProp(this, 'completedTodosCount', _descriptor2, this);

    _initDefineProp(this, 'removeAllTodosCallback', _descriptor3, this);

    _initDefineProp(this, 'removeCompletedTodosCallback', _descriptor4, this);

    _initDefineProp(this, 'toggleAllTodosCallback', _descriptor5, this);

    _initDefineProp(this, 'completeAllTodosCallback', _descriptor6, this);
  }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'allTodosCount', [_dec2], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'completedTodosCount', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'removeAllTodosCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'removeCompletedTodosCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'toggleAllTodosCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'completeAllTodosCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('resources/elements/todo-item',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TodoItem = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var TodoItem = exports.TodoItem = (_dec = (0, _aureliaFramework.customElement)('todo-item'), _dec(_class = (_class2 = function () {
    function TodoItem() {
      _classCallCheck(this, TodoItem);

      _initDefineProp(this, 'todo', _descriptor, this);

      _initDefineProp(this, 'removeCallback', _descriptor2, this);

      _initDefineProp(this, 'updateCallback', _descriptor3, this);
    }

    TodoItem.prototype.attached = function attached() {};

    return TodoItem;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'todo', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'removeCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'updateCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('resources/elements/todo-list',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TodoList = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var TodoList = exports.TodoList = (_dec = (0, _aureliaFramework.customElement)('todo-list'), _dec(_class = (_class2 = function () {
    function TodoList() {
      _classCallCheck(this, TodoList);

      _initDefineProp(this, 'todos', _descriptor, this);

      _initDefineProp(this, 'host', _descriptor2, this);

      _initDefineProp(this, 'removeCallback', _descriptor3, this);

      _initDefineProp(this, 'updateCallback', _descriptor4, this);
    }

    TodoList.prototype.activate = function activate() {};

    TodoList.prototype.removeTodo = function removeTodo(todo) {
      this.host.removeTodo(todo);
    };

    TodoList.prototype.updateTodo = function updateTodo(todo) {
      this.host.updateTodo(todo);
    };

    return TodoList;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'todos', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'host', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'removeCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'updateCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"../styles/styles.css\"></require><require from=\"./resources/attributes/auto-focus\"></require><h1>${appName}</h1><form method=\"post\" submit.trigger=\"addTodo()\"><input type=\"text\" placeholder=\"What would you like to do?\" value.bind=\"todoTitle\" auto-focus> <button type=\"submit\">Add</button></form><br><br><div><a href=\"#\" click.trigger=\"filterTodos('all')\">All</a> <a href=\"#\" click.trigger=\"filterTodos('active')\">Active</a> <a href=\"#\" click.trigger=\"filterTodos('completed')\">Completed</a></div><div><strong>${allTodosCount}</strong>${allTodosCount === 1 ? ' task ': ' tasks '} | <strong>${activeTodosCount}</strong>${activeTodosCount === 1 ? ' task ': ' tasks '} left | <strong>${completedTodosCount}</strong>${completedTodosCount === 1 ? ' task ': ' tasks '} completed</div><br><div><button disabled.bind=\"allTodosCount === 0\" click.trigger=\"removeAllTodos()\">Remove All</button> <button disabled.bind=\"completedTodosCount === 0\" click.trigger=\"removeCompletedTodos()\">Remove Completed</button> <button disabled.bind=\"allTodosCount === 0\" click.trigger=\"toggleAllTodos()\">Toggle All</button> <button disabled.bind=\"allTodosCount === 0\" click.trigger=\"completeAllTodos()\">Complete All</button></div><ul><li repeat.for=\"t of todos\"><input type=\"checkbox\" checked.bind=\"t.completed\"> <input show.bind=\"t.editMode\" type=\"text\" value.bind=\"t.title\"> <span show.two-way=\"!t.editMode\" click.trigger=\"updateTodo(t)\" class.bind=\"t.completed ? 'strikeout': ''\">${t.id} -${t.title}</span><button type=\"button\" click.trigger=\"removeTodo(t)\">Remove</button> <button type=\"button\" click.trigger=\"updateTodo(t)\">${t.editMode ? 'Update' : 'Edit'}</button></li></ul></template>"; });
define('text!../styles/styles.css', ['module'], function(module) { module.exports = "body {\n  font-family: Verdana, Arial;\n  color: blue; }\n\n.strikeout {\n  text-decoration: line-through; }\n\nul {\n  padding-left: 10px; }\n\nli {\n  list-style-type: none; }\n"; });
define('text!shell.html', ['module'], function(module) { module.exports = "<template><require from=\"../styles/styles.css\"></require><h1>${appName}</h1><require from=\"./resources/elements/todo-add\"></require><require from=\"./resources/elements/todo-filter\"></require><require from=\"./resources/elements/todo-action\"></require><require from=\"./resources/elements/todo-list\"></require><todo-add todo-title.bind=\"todoTitle\" todo-completed.bind=\"todoCompleted\" add-callback.call=\"addTodo($event)\"></todo-add><br><br><todo-filter all-todos-count.bind=\"allTodosCount\" active-todos-count.bind=\"activeTodosCount\" completed-todos-count.bind=\"completedTodosCount\" active-filter.bind=\"activeFilter\" filter-todos-callback.call=\"filterTodos($event)\"></todo-filter><br><todo-action all-todos-count.bind=\"allTodosCount\" completed-todos-count.bind=\"completedTodosCount\" remove-all-todos-callback.call=\"removeAllTodos()\" remove-completed-todos-callback.call=\"removeCompletedTodos()\" toggle-all-todos-callback.call=\"toggleAllTodos()\" complete-all-todos-callback.call=\"completeAllTodos()\"></todo-action><br><todo-list todos.bind=\"todos\" host.bind=\"self\" remove-callback.call=\"removeTodo($event)\" update-callback.call=\"updateTodo($event)\"></todo-list></template>"; });
define('text!resources/elements/todo-add.html', ['module'], function(module) { module.exports = "<template><require from=\"../attributes/auto-focus\"></require><require from=\"../attributes/keyup-enter\"></require><form method=\"post\"><input type=\"checkbox\" checked.bind=\"todoCompleted\"> <input type=\"text\" placeholder=\"What would you like to do?\" value.bind=\"todoTitle\" auto-focus keyup-enter.call=\"addCallback({title: todoTitle, completed: todoCompleted})\"> <button type=\"button\" click.delegate=\"addCallback({title: todoTitle, completed: todoCompleted})\">Add</button></form></template>"; });
define('text!resources/elements/todo-filter.html', ['module'], function(module) { module.exports = "<template><div><a href=\"#\" click.delegate=\"filterTodosCallback('all')\">All</a> | <a href=\"#\" click.delegate=\"filterTodosCallback('active')\">Active</a> | <a href=\"#\" click.delegate=\"filterTodosCallback('completed')\">Completed</a></div><div><strong>${allTodosCount}</strong>${allTodosCount === 1 ? ' task ': ' tasks '} | <strong>${activeTodosCount}</strong>${activeTodosCount === 1 ? ' task ': ' tasks '} left | <strong>${completedTodosCount}</strong>${completedTodosCount === 1 ? ' task ': ' tasks '} completed</div></template>"; });
define('text!resources/elements/todo-action.html', ['module'], function(module) { module.exports = "<template><div><button disabled.bind=\"allTodosCount === 0\" click.trigger=\"removeAllTodosCallback()\">Remove All</button> <button disabled.bind=\"completedTodosCount === 0\" click.trigger=\"removeCompletedTodosCallback()\">Remove Completed</button> <button disabled.bind=\"allTodosCount === 0\" click.trigger=\"toggleAllTodosCallback()\">Toggle All</button> <button disabled.bind=\"allTodosCount === 0\" click.trigger=\"completeAllTodosCallback()\">Complete All</button></div></template>"; });
define('text!resources/elements/todo-item.html', ['module'], function(module) { module.exports = "<template><li><input type=\"checkbox\" checked.bind=\"todo.completed\"> <input show.bind=\"todo.editMode\" type=\"text\" value.bind=\"todo.title\"> <span show.two-way=\"!todo.editMode\" click.delegate=\"updateCallback(todo)\" class.bind=\"todo.completed ? 'strikeout' : ''\">${todo.id} - ${todo.title}</span><button type=\"button\" click.delegate=\"removeCallback(todo)\">Remove</button> <button type=\"button\" click.delegate=\"updateCallback(todo)\">${todo.editMode ? 'Update' : 'Edit'}</button></li><template></template></template>"; });
define('text!resources/elements/todo-list.html', ['module'], function(module) { module.exports = "<template><require from=\"./todo-item\"></require><ul><todo-item repeat.for=\"todo of todos\" todo.bind=\"todo\" remove-callback.call=\"removeCallback($event)\" update-callback.call=\"updateCallback($event)\"></todo-item></ul></template>"; });
//# sourceMappingURL=app-bundle.js.map