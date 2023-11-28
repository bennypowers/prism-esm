import { loader as rubyLoader } from "./prism-ruby.js"

/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['crystal']) {
      return
    }
	if (!Prism.languages.ruby) {
		rubyLoader(Prism)
	}

	Prism.languages.crystal = Prism.languages.extend('ruby', {
		'keyword': [
			/\b(?:__DIR__|__END_LINE__|__FILE__|__LINE__|abstract|alias|annotation|as|asm|begin|break|case|class|def|do|else|elsif|end|ensure|enum|extend|for|fun|if|ifdef|include|instance_sizeof|lib|macro|module|next|of|out|pointerof|private|protected|ptr|require|rescue|return|select|self|sizeof|struct|super|then|type|typeof|undef|uninitialized|union|unless|until|when|while|with|yield)\b/,
			{
				pattern: /(\.\s*)(?:is_a|responds_to)\?/,
				lookbehind: true
			}
		],
		'number': /\b(?:0b[01_]*[01]|0o[0-7_]*[0-7]|0x[\da-fA-F_]*[\da-fA-F]|(?:\d(?:[\d_]*\d)?)(?:\.[\d_]*\d)?(?:[eE][+-]?[\d_]*\d)?)(?:_(?:[uif](?:8|16|32|64))?)?\b/,
		'operator': [
			/->/,
			Prism.languages.ruby.operator,
		],
		'punctuation': /[(){}[\].,;\\]/,
	});

	Prism.languages.insertBefore('crystal', 'string-literal', {
		'attribute': {
			pattern: /@\[.*?\]/,
			inside: {
				'delimiter': {
					pattern: /^@\[|\]$/,
					alias: 'punctuation'
				},
				'attribute': {
					pattern: /^(\s*)\w+/,
					lookbehind: true,
					alias: 'class-name'
				},
				'args': {
					pattern: /\S(?:[\s\S]*\S)?/,
					inside: Prism.languages.crystal
				},
			}
		},
		'expansion': {
			pattern: /\{(?:\{.*?\}|%.*?%)\}/,
			inside: {
				'content': {
					pattern: /^(\{.)[\s\S]+(?=.\}$)/,
					lookbehind: true,
					inside: Prism.languages.crystal
				},
				'delimiter': {
					pattern: /^\{[\{%]|[\}%]\}$/,
					alias: 'operator'
				}
			}
		},
		'char': {
			pattern: /'(?:[^\\\r\n]{1,2}|\\(?:.|u(?:[A-Fa-f0-9]{1,4}|\{[A-Fa-f0-9]{1,6}\})))'/,
			greedy: true
		}
	});
}