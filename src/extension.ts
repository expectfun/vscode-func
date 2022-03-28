import * as vscode from 'vscode';


// TODO: fully implement stdlib
export function activate(context: vscode.ExtensionContext) {
	const provider1 = vscode.languages.registerCompletionItemProvider('func', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
            // a completion item that retriggers IntelliSense when being accepted,
			// the `command`-property is set which the editor will execute after 
			// completion has been inserted. Also, the `insertText` is set so that 
			// a space is inserted after `new`
            let functionNames = ['recv_internal', 'main', 'recv_external', 'run_tick_tock'];
            let functionCompletions = functionNames.map(kv => {
                const commandCompletion = new vscode.CompletionItem(kv);
                commandCompletion.kind = vscode.CompletionItemKind.Snippet;
                commandCompletion.commitCharacters = ['{'];
                commandCompletion.insertText = `${kv}(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) `;
                commandCompletion.documentation = new vscode.MarkdownString(`Press \`.\` to get \`${kv}(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body)\``);
                return commandCompletion
            })

            let keywords = [
                'impure',
                'global',
                'return',
                'int',
                'var',
                'cell',
                'slice',
            ]

            let globalMethods = [
                'get_data',
                'set_data',
                'begin_cell',
            ]
            let methodsCompletions = globalMethods.map(m => {
                let completion = new vscode.CompletionItem(m, vscode.CompletionItemKind.Method)
                if (m === 'set_data') {
                    completion.insertText = new vscode.SnippetString(`${m}($0)`)
                } else {
                    completion.insertText = `${m}()`
                }
                return completion
            })
			// return all completion items as array
			return [
                ...keywords.map(kv => new vscode.CompletionItem(kv)),
                ...functionCompletions,
                ...methodsCompletions,
			];
		}
	});

	const provider2 = vscode.languages.registerCompletionItemProvider(
		'func',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('~') && !linePrefix.endsWith('.')) {
					return undefined;
				}


                let slicePrimitives = [
                    'begin_parse',
                    'end_parse',
                    'load_int',
                    'load_uint',
                    'preload_int',
                    'preload_uint',
                    'load_bits',
                    'preload_bits',
                    'skip_bits',
                    'first_bits',
                    'skip_last_bits',
                    'slice_last',
                    'load_dict',
                    'preload_dict',
                    'load_ref',
                    'preload_ref',
                    'load_grams',
                    'slice_refs',
                    'slice_bits',
                    'slice_bits_refs',
                    'slice_empty?',
                    'slice_data_empty?',
                    'slice_depth'
                ]

                let builderPrimitives = [
                    'begin_cell',
                    'end_cell',
                    'store_ref',
                    'store_int',
                    'store_uint',
                    'store_slice',
                    'store_grams',
                    'store_dict',
                    'store_maybe_ref',
                    'builder_refs',
                    'builder_bits',
                    'builder_depth',
                ]

                let cellPrimitives = [
                    'cell_depth',
                    'cell_null?'
                ]

                let methodsAfterSpecialChars = [
                    ...slicePrimitives,
                    ...builderPrimitives,
                    ...cellPrimitives,
                ]

				return [
                    ...methodsAfterSpecialChars.map(mtd => new vscode.CompletionItem(mtd, vscode.CompletionItemKind.Method))
                ];
			}
		},
		'.', '~'
	);

	context.subscriptions.push(provider1, provider2);
}