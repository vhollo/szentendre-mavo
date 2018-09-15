(function($) {

var parser, serializer;

Mavo.Plugins.register("tinymce", {
	/* ready: $.include(self.tinymce, "https://cdn.tinymce.com/4/tinymce.min.js").then(() => { */
	ready: $.include(self.tinymce, "tinymce/tinymce.min.js").then(() => {
		parser = new tinymce.html.DomParser();
		serializer = new tinymce.html.Serializer();
	})
});

Mavo.Elements.register(".tinymce", {
	hasChildren: true,
	default: true,
	edit: function() {
		this.preEdit.then(evt => {
			if (this.element.tinymce) {
				// Previously edited, we already have an editor
				tinymce.EditorManager.execCommand("mceAddEditor", true, this.element.tinymce.id);
				return;
			}

			// Init for the first time
			tinymce.init({
				target: this.element,
				inline: true,
				menubar: false,
				style_formats: [
					{ title: 'Heading', block: 'h2' },
					{ title: 'Subhead', block: 'h3' },
					{ title: 'Sub-subhead', block: 'h4' },
					{ title: 'Author', block: 'p', classes: 'author' }
				],
				powerpaste_word_import: 'clean',
				powerpaste_html_import: 'clean',
				toolbar: "styleselect | h2 bold italic underline blockquote | table | bullist numlist | superscript subscript | removeformat",
				plugins: "link table lists tabfocus",
				schema: 'html5',
				element_format : 'html',
				entity_encoding : "raw",
				remove_trailing_brs: false
			}).then(editors => {
				this.element.tinymce = editors[0];

				this.element.tinymce.on("change keyup paste cut", evt => {
					this.value = this.getValue();
				});
			});
		});
	},
	done: function() {
		if (this.tinymce) {
			tinymce.EditorManager.execCommand("mceRemoveEditor", true, this.tinymce.id);
		}
	},
	getValue: (element) => {
		return element.tinymce ? element.tinymce.getContent() : element.innerHTML;
	},
	setValue: (element, value) => {
		const content = serializer.serialize(parser.parse(value));
		
		if (!element.tinymce) {
			element.innerHTML = content;
		}
		else if (element.tinymce.isHidden()) {
			element.tinymce.setContent(content);
		}
	}
});

})(Bliss);
