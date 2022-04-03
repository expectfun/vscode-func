import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DocumentStore } from '../documentStore';
import { Trees } from '../trees';
import { queryGlobals } from '../queries/globals';

export class DocumentSymbols {
	constructor(private readonly _documents: DocumentStore, private readonly _trees: Trees) { }

	register(connection: lsp.Connection) {
		connection.client.register(lsp.DocumentSymbolRequest.type);
		connection.onRequest(lsp.DocumentSymbolRequest.type, this.provideDocumentSymbols.bind(this));
	}

	async provideDocumentSymbols(params: lsp.DocumentSymbolParams): Promise<lsp.DocumentSymbol[]> {
		const document = await this._documents.retrieve(params.textDocument.uri);
		let symbols = getDocumentSymbols(document, this._trees);
        return symbols;
	}
}

export function getDocumentSymbols(document: TextDocument, trees: Trees): lsp.DocumentSymbol[] {
	const tree = trees.getParseTree(document);
	if (!tree) {
		return [];
	}
    const globals = queryGlobals(tree.rootNode);

    const result: lsp.DocumentSymbol[] = [];
    for (let declaration of globals) {
        result.push(
            lsp.DocumentSymbol.create(
                declaration.text, 
                '', 
                declaration.type === 'globalVar' ? lsp.SymbolKind.Variable : lsp.SymbolKind.Function, 
                declaration.range, 
                declaration.range
            )
        );
    }
    return result;
}