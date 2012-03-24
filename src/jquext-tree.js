
///////////////////////////////////////////////////////////////////////////////
// define the tree extension
/**
 * Methods of jQuext tree widget module.
 *     .add(row_data [,index]);
 *     .remove(index);
 *     .getAll();
 *     .get(index);
 *     .select();
 *     .select(index);
 *     .dispose();
 */
$$('tree', ['jQuery', 'util', 'widget'], function($, $util, $widget){
	var $tree = $widget.create(); // create the tree widget

	$tree.fn.init = function(settings){
        var js_dir = $util.getJsRootDir() + 'styles/';
        tree.nodeExpand = js_dir + 'tree/tree-plus.gif';
        tree.nodeCollapse = js_dir + 'tree/tree-minus.gif';
        tree.nodeNone = js_dir + 'tree/tree-none.gif';
        tree.nodeSubNone = js_dir + 'tree/tree-none-sub.gif';

        this.context = $(this.parent); // set the context
		this.context.data('settings',  settings);
        var root = this.context.get(0);

        if(settings.tree_data != null){
            var ul = $('<ul class="tree"></ul>');
            var nodes = settings.tree_data;
            for(var i=0; i< nodes.length; i++){
                _addTreeNode(ul, nodes[i], true);
            }
            this.context.append(ul);
            tree.init(root);
            // tree.expandAll(root);
        }
    };

    var _addTreeNode = function(parent, node, isRoot){
        var js_dir = $util.getJsRootDir() + 'styles/';
        var liclass = isRoot? ' class="root"': '';
        var li = $('<li' + liclass + '><img class="icon" src="' +
			js_dir + 'tree/folder_opened.png"/><span>' +
			node.title + '</span></li>');
        node.children = node.children || [];
        if(node.children.length>0){
            var ul = $('<ul></ul>');
            for(var i=0; i< node.children.length; i++){
                _addTreeNode(ul, node.children[i], false);
            }
            li.append(ul);
        } else {
            $('>img.icon', li).attr('src', '' + js_dir + 'tree/icon.png');
        }
        parent.append(li);
    };

    var _tree_changState = function(ele){
        var js_dir = $util.getJsRootDir() + 'styles/';
        if(ele.state == 'collapsed'){
            $('>img.icon', ele).attr('src', js_dir + 'tree/folder.png');
        } else {
            $('>img.icon', ele).attr('src', js_dir + 'tree/folder_opened.png');
        }
    };

	///////////////////////////////////////////////////////////////////////////

	/*
	find actual version of this library at:
	http://www.fczbkk.com/js/dom/
	*/

	// library for cross-browser event management
	var evt = {

		// attach event
		add : function(obj, evType, fn, useCapture) {
			// Opera hack
			if (window.opera && (obj == window)) {
				obj = document;
			}
			
			if (obj.addEventListener){
				obj.addEventListener(evType, fn, useCapture);
				return true;
			} else if (obj.attachEvent){
				var r = obj.attachEvent("on"+evType, fn);
				return r;
			} else {
				return false;
			}
		},
		
		// remove event
		remove : function(obj, evType, fn, useCapture) {
			// Opera hack
			if (window.opera && (obj == window)) {
				obj = document;
			}
			
			if (obj.removeEventListener) {
				obj.removeEventListener(evType, fn, useCapture);
				return true;
			} else if (obj.detachEvent) {
				var r = obj.detachEvent("on"+evType, fn);
				return r;
			} else {
				return false;
			}
		},
		
		// fix for IE event model
		fix : function(e) {
			if (typeof e == 'undefined') {
				e = window.event;
			}
			if (typeof e.target == 'undefined') {
				e.target = e.srcElement;
			}
			if (typeof e.layerX == 'undefined') {
				e.layerX = e.offsetX;
			}
			if (typeof e.layerY == 'undefined') {
				e.layerY = e.offsetY;
			}
			if ((typeof e.which == 'undefined') && e.keyCode) {
				e.which = e.keyCode;
			}

			// thanx to KKL2401 for preventDefault hack
			if (!e.preventDefault) {
				e.preventDefault = function() {
					e.returnValue = false;
				};
			}

			return e;
		}

	};



	// library for working with multiple classes
	var actCl, tempCl;
	var cls = {
		
		// vrati pole obsahujuce vsetky triedy daneho elementu
		get : function (elm) {
			if (elm && elm.tagName) {
				var classes = [];
				if (elm.className) {    // na zaklade Centiho upozornenia o divnej interpretacii v Opere
					var cl = elm.className.replace(/\s+/g, " ");
					classes = cl.split(" ");
				}
				return classes;
			}
			return false;
		},
		
		// vrati true, ak element obsahuje triedu
		has : function (elm, cl) {
			if ((actCl = cls.get(elm)) && (typeof(cl) == "string")) {
				for (var i = 0; i < actCl.length; i++) {
					if (actCl[i] == cl) {
						return true;
					}
				}
			}
			return false;
		},
		
		// prida triedu elementu
		add : function (elm, cl) {
			if ((actCl = cls.get(elm)) && (typeof(cl) == "string")) {
				if (!cls.has(elm, cl)) {
					elm.className += (actCl.length > 0) ? " " + cl : cl;
				}
				return true;
			}
			return false;
		},
		
		// odstrani triedu z elementu
		remove : function (elm, cl) {
			if ((actCl = cls.get(elm)) && (typeof(cl) == "string")) {
				tempCl = "";
				for (var i = 0; i < actCl.length; i++) {
					if (actCl[i] != cl) {
						if (tempCl !== "") {tempCl += " ";}
						tempCl += actCl[i];
					}
					elm.className = tempCl;
				}
				return true;
			}
			return false;
		},
		
		// nahradi staru triedu elementu novou, ak stara neexistuje, prida novu
		replace : function (elm, oldCl, newCl) {
			if ((actCl = cls.get(elm)) && (typeof(oldCl) == "string") && (typeof(newCl) == "string")) {
				tempCl = "";
				if (cls.has(elm, newCl)) {
					cls.remove(elm, oldCl);
				} else if (cls.has(elm, oldCl)) {
					for (var i = 0; i < actCl.length; i++) {
						if (tempCl !== "") {tempCl += " ";}
						tempCl += (actCl[i] == oldCl) ? newCl : actCl[i];
					}
					elm.className = tempCl;
				} else {
					cls.add(elm, newCl);
				}
				return true;
			}
			return false;
		}

	};

	/*

	tree (version 3.5) by Riki "Fczbkk" Fridrich, 2002
	http://www.fczbkk.com/
	mailto:riki@fczbkk.com

	You should find latest version of this script and documentation at
	http://www.fczbkk.com/js/tree/

	*/



	// object holding all functions and variables
	var tree = {
		/* ------------------ user customization starts here ------------------ */
		
		// classes used in HTML document to mark important elements
		classRoot           : "tree",       // ULs with this class will be transformed into trees
		classDefault        : "default",    // LIs with this class will be expanded by default
		classLast           : "last",       // this class will be added to all last branches of the tree
											// (this is good for easier CSS formatting of the tree)
		
		// paths to images used in tree nodes
		nodeExpand          : "tree/tree-plus.gif",       // image of expandable node
		nodeExpandAlt       : "",
		nodeCollapse        : "tree/tree-minus.gif",      // image of collapsable node
		nodeCollapseAlt     : "",
		nodeSubNone            : "tree/tree-none-sub.gif",       // image for node without children
		nodeNone            : "tree/tree-none.gif",       // image for root node without children
		nodeNoneAlt         : "",
		
		/* ------------------ user customization ends here ------------------ */


		// initialisation of the tree
		init : function(elm) {
			// find all unordered lists marked as trees
			var uls = tree.getElementsByClassName(elm, tree.classRoot, "ul");
			for (var i = 0; i < uls.length; i++) {
				// find all last branches of the tree and mark them
				tree.markLast(uls[i]);
				var uls2 = uls[i].getElementsByTagName("ul");
				for (var j = 0; j < uls2.length; j++) {
					tree.markLast(uls2[j]);
				}
				
				// ad node pictures to all branches
				var lis = uls[i].getElementsByTagName("li");
				for (j = 0; j < lis.length; j++) {
					tree.addNode(lis[j]);
				}
				
				// collapse all branches at the start
				tree.collapseAll(uls[i]);
				
				// find default branches and expand them
				var def = tree.getElementsByClassName(uls[i], tree.classDefault, "li");
				for (j = 0; j < def.length; j++) {
					var path = [];
					var step = def[j];
					while (step != uls[i]) {
						if (step.tagName == "LI") {
							tree.expand(step);
						}
						step = step.parentNode;
					}
				}
			}
		},

		// adds node picture at the beginning of all branches
		addNode : function(elm) {
			var uls = elm.getElementsByTagName("ul");
			var image = document.createElement("img");
			if (uls.length > 0) {
				image.src = tree.nodeExpand;
				image.alt = tree.nodeExpandAlt;
				evt.add(image, "click", tree.changeState);
			} else {
				if(cls.has(elm, 'root')){
					image.src = tree.nodeNone;
				} else {
					image.src = tree.nodeSubNone;
				}
				image.alt = tree.nodeNoneAlt;
			}
			elm.insertBefore(image, elm.firstChild);
		},
		
		// gets the actual state of branch and changes it
		changeState : function(e) {
			e = evt.fix(e);
			var obj = (e.currentTarget) ? e.currentTarget : e.target;
			while (obj.tagName != "LI") {
				obj = obj.parentNode;
			}
			if (obj.state == "collapsed") {
				tree.expand(obj);
			} else {
				tree.collapse(obj);
			}
			_tree_changState(obj);
		},
		
		// expands given branch
		expand : function(elm) {
			var uls = elm.getElementsByTagName("ul");
			for (var i = 0; i < uls.length; i++) {
				if (uls[i].parentNode == elm) {
					uls[i].style.display = "block";
					uls[i].parentNode.state = "expanded";
					elm.firstChild.src = tree.nodeCollapse;
					elm.firstChild.alt = tree.nodeCollapseAlt;
				}
			}
		},
		
		// collapses given branch
		collapse : function(elm) {
			var uls = elm.getElementsByTagName("ul");
			for (var i = 0; i < uls.length; i++) {
				if (uls[i].parentNode == elm) {
					uls[i].style.display = "none";
					uls[i].parentNode.state = "collapsed";
					elm.firstChild.src = tree.nodeExpand;
					elm.firstChild.alt = tree.nodeExpandAlt;
				}
			}
		},
		
		// collapses all branches in the given tree
		collapseAll : function(elm) {
			if (elm.tagName == "LI") {tree.expand(elm);}
			var lis = elm.getElementsByTagName("li");
			for (var i = 0; i < lis.length; i++) {
				tree.collapse(lis[i]);
			}
		},
		
		// expands all branches in the given tree
		expandAll : function(elm) {
			if (elm.tagName == "LI") {tree.expand(elm);}
			var lis = elm.getElementsByTagName("li");
			for (var i = 0; i < lis.length; i++) {
				tree.expand(lis[i]);
			}
		},
		
		// marks the last branch in the given branch as last
		markLast : function(elm) {
			var lis = elm.getElementsByTagName("li");
			var i = lis.length - 1;
			while (lis[i].parentNode != elm) {i--;}
			cls.add(lis[i], tree.classLast);
		},
		
		// returns all elements with given class, that are children of given source element
		// attribute tagName is not required, but it speeds up the function a bit
		getElementsByClassName : function(srcElm, clName, tName) {
			var foundElements = [];
			tName = (tName) ? tName.toUpperCase() : "*";
			var allElements = srcElm.getElementsByTagName(tName);
			for (var i = 0; i < allElements.length; i++) {
				if (cls.has(allElements[i], clName)) {
					foundElements[foundElements.length] = allElements[i];
				}
			}
			return foundElements;
		}

	};

	///////////////////////////////////////////////////////////////////////////

    return $tree; // return the tree export object

});
