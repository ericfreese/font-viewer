'use babel'
import path from 'path';
import _ from 'underscore-plus';
import FontViewer from './font-viewer';


let openerDisposable

export function activate() {
    // Files with these extensions will be opened as fonts
    const fontExtensions = ['.otf', '.ttf', '.woff'];
    openerDisposable = atom.workspace.addOpener(
        (uriToOpen) => {
            const uriExtension = path.extname(uriToOpen).toLowerCase();
            if (_.include(fontExtensions, uriExtension)) {
                return new FontViewer(uriToOpen);
            }
        }
    );
}

export function deactivate() {
    openerDisposable.dispose();
}
