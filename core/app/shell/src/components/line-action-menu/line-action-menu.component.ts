/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Component, Input, OnInit} from '@angular/core';
import {LanguageStore} from '@store/language/language.store';
import {Record} from '@app-common/record/record.model';
import {LineAction} from '@app-common/actions/line-action.model';

@Component({
    selector: 'scrm-line-action-menu',
    templateUrl: 'line-action-menu.component.html'
})

export class LineActionMenuComponent implements OnInit {

    @Input() lineActions: LineAction[];
    @Input() record: Record;

    items: LineAction[];

    constructor(protected languageStore: LanguageStore) {
    }

    ngOnInit(): void {
        this.setLineActions();
    }

    setLineActions(): void {
        const actions = [];
        this.lineActions.forEach(action => {
            const recordAction = {...action};

            const params: { [key: string]: any } = {};
            /* eslint-disable camelcase,@typescript-eslint/camelcase*/
            params.return_module = action.legacyModuleName;
            params.return_action = action.returnAction;
            params.return_id = this.record.id;
            /* eslint-enable camelcase,@typescript-eslint/camelcase */
            params[action.mapping.moduleName] = action.legacyModuleName;

            params[action.mapping.name] = this.record.attributes.name;
            params[action.mapping.id] = this.record.id;

            recordAction.label = this.languageStore.getAppString(recordAction.labelKey);
            recordAction.link = {
                label: recordAction.label,
                url: null,
                route: '/' + action.module + '/' + action.action,
                params
            };

            actions.push(recordAction);
        });
        this.items = actions.reverse();
    }
}