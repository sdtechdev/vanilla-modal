/**
 * @class VanillaModal
 * @version 2.0.0
 * @author Ben Ceglowski
 */
const instanceID = 0

const transitionSupport = ('ontransitionend' in window)

const defaultTemplate = `
  <div data-vanilla-modal>
    <div data-vanilla-modal-inner>
      <div data-vanilla-modal-content />
    </div>
  </div>
`

function applySettings(settings, userSettings) {
  return Object.assign({}, settings, userSettings)
}

function addAttribute(attribute) {
  document.setAttribute(`data-vanilla-modal-${attribute}`, '')
}

function removeAttribute(attribute) {
  document.removeAttribute(`data-vanilla-modal-${attribute}`)
}

function getNode(node, parent = document) {
  try {
    return parent.querySelector(node)
  } catch(e) {
    throw new Error(e)
  }
}

function nodeFromString(template) {
  const parent = document.createElement('div')
  parent.innerHTML = template
  return parent.children[0]
}

function renderNode(node) {
  const appendedNode = document.body.appendChild(node)
  return appendedNode
}

function setupDomNodes(settings) {
  const ctx = (typeof settings.template === 'string' ? renderNode(nodeFromString(settings.template)) : document)
  const modal = getNode(settings.modal, ctx)
  const modalInner = getNode(settings.modalInner, modal)
  const modalContent = getNode(settings.modalContent, modalInner)
  return {
    modal,
    modalInner,
    modalContent
  }
}

function close(settings) {
  return function(callback) {
    removeAttribute('open')
    releaseNode(this.current)
    this.isOpen = false;
    this.current = null;
  }
}

const defaults = {
  modal: '[data-vanilla-modal]',
  modalInner: '[data-vanilla-modal-inner]',
  modalContent: '[data-vanilla-modal-content]',
  open: '[data-vanilla-modal-open]',
  close: '[data-vanilla-modal-close]',
  ref: null,
  clickOutside: true,
  closeKeys: [27],
  template: defaultTemplate
}

const VanillaModal = function(userSettings = {}) {
  const settings = applySettings(defaults, userSettings)
  const nodes = setupDomNodes(settings)
  this.isOpen = false
  this.current = null
}

//
//
//
//
// export default class VanillaModal {
//
//   _setOpenId() {
//     var id = this.current.id || 'anonymous';
//     this.$.page.setAttribute('data-current-modal', id);
//   }
//
//   _removeOpenId() {
//     this.$.page.removeAttribute('data-current-modal');
//   }
//
//   /**
//    * @param {Event} e
//    */
//   _open(matches, e) {
//     this._releaseNode();
//     this.current = this._getElementContext(matches);
//     if (this.current instanceof HTMLElement === false) return console.error('VanillaModal target must exist on page.');
//     if (typeof this.$$.onBeforeOpen === 'function') this.$$.onBeforeOpen.call(this, e);
//     this._captureNode();
//     this._addClass(this.$.page, this.$$.class);
//     this._setOpenId();
//     this.isOpen = true;
//     if (typeof this.$$.onOpen === 'function') this.$$.onOpen.call(this, e);
//   }
//
//   _detectTransition() {
//     var css = window.getComputedStyle(this.$.modal, null);
//     var transitionDuration = ['transitionDuration', 'oTransitionDuration', 'MozTransitionDuration', 'webkitTransitionDuration'];
//     var hasTransition = transitionDuration.filter(function(i) {
//       if (typeof css[i] === 'string' && parseFloat(css[i]) > 0) {
//         return true;
//       }
//     });
//     return (hasTransition.length) ? true : false;
//   }
//
//   /**
//    * @param {Event} e
//    */
//   _close(e) {
//     if(this.isOpen === true) {
//       this.isOpen = false;
//       if (typeof this.$$.onBeforeClose === 'function') this.$$.onBeforeClose.call(this, e);
//       this._removeClass(this.$.page, this.$$.class);
//       var transitions = this._detectTransition();
//       if (this.$$.transitions && this.$$.transitionEnd && transitions) {
//         this._closeModalWithTransition(e);
//       } else {
//         this._closeModal(e);
//       }
//     }
//   }
//
//   _closeModal(e) {
//     this._removeOpenId(this.$.page);
//     this._releaseNode();
//     this.isOpen = false;
//     this.current = null;
//     if (typeof this.$$.onClose === 'function') this.$$.onClose.call(this, e);
//   }
//
//   _closeModalWithTransition(e) {
//     var _closeTransitionHandler = function() {
//       this.$.modal.removeEventListener(this.$$.transitionEnd, _closeTransitionHandler);
//       this._closeModal(e);
//     }.bind(this);
//     this.$.modal.addEventListener(this.$$.transitionEnd, _closeTransitionHandler);
//   }
//
//   _captureNode() {
//     if (this.current) {
//       while (this.current.childNodes.length > 0) {
//         this.$.modalContent.appendChild(this.current.childNodes[0]);
//       }
//     }
//   }
//
//   _releaseNode() {
//     if (this.current) {
//       while (this.$.modalContent.childNodes.length > 0) {
//         this.current.appendChild(this.$.modalContent.childNodes[0]);
//       }
//     }
//   }
//
//   /**
//    * @param {Event} e
//    */
//   _closeKeyHandler(e) {
//     if (Object.prototype.toString.call(this.$$.closeKeys) !== '[object Array]' || this.$$.closeKeys.length === 0) return;
//     if (this.$$.closeKeys.indexOf(e.which) > -1 && this.isOpen === true) {
//       e.preventDefault();
//       this.close(e);
//     }
//   }
//
//   /**
//    * @param {Event} e
//    */
//   _outsideClickHandler(e) {
//     if (this.$$.clickOutside !== true) return;
//     var node = e.target;
//     while(node && node != document.body) {
//       if (node === this.$.modalInner) return;
//       node = node.parentNode;
//     }
//     this.close(e);
//   }
//
//   /**
//    * @param {Event} e
//    * @param {String} selector
//    */
//   _matches(e, selector) {
//     var el = e.target;
//     var matches = (el.document || el.ownerDocument).querySelectorAll(selector);
//     for (let i = 0; i < matches.length; i++) {
//       let child = el;
//       while (child && child !== document.body) {
//         if (child === matches[i]) return child;
//         child = child.parentNode;
//       }
//     }
//     return null;
//   }
//
//   /**
//    * @param {Event} e
//    */
//   _delegateOpen(e) {
//     var matches = this._matches(e, this.$$.open);
//     if (matches) {
//       e.preventDefault();
//       e.delegateTarget = matches;
//       return this.open(matches, e);
//     }
//   }
//
//   /**
//    * @param {Event} e
//    */
//   _delegateClose(e) {
//     if (this._matches(e, this.$$.close)) {
//       e.preventDefault();
//       return this.close(e);
//     }
//   }
//
//   /**
//    * @private {Function} add
//    */
//   _events() {
//
//     let _closeKeyHandler = this._closeKeyHandler.bind(this);
//     let _outsideClickHandler = this._outsideClickHandler.bind(this);
//     let _delegateOpen = this._delegateOpen.bind(this);
//     let _delegateClose = this._delegateClose.bind(this);
//
//     var add = function() {
//       this.$.modal.addEventListener('click', _outsideClickHandler, false);
//       document.addEventListener('keydown', _closeKeyHandler, false);
//       document.addEventListener('click', _delegateOpen, false);
//       document.addEventListener('click', _delegateClose, false);
//     };
//
//     this.destroy = function() {
//       this.close();
//       this.$.modal.removeEventListener('click', _outsideClickHandler);
//       document.removeEventListener('keydown', _closeKeyHandler);
//       document.removeEventListener('click', _delegateOpen);
//       document.removeEventListener('click', _delegateClose);
//     };
//
//     return {
//       add : add.bind(this)
//     };
//
//   }
//
// }
