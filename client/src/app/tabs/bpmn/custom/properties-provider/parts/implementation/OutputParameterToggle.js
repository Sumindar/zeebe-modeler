/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import { query as domQuery } from 'min-dom';

import { is } from 'bpmn-js/lib/util/ModelUtil';


/**
 * Create an input or output mapping entry for a single input or output entry
 * @param {Function} translate - translate function.
 * @param {Object} options - Options.
 * @param {string} [options.idPrefix] - preFix used to construct the 'id' of the GUI entries
 * @param {string} [options.prop] - moddle (zeebe-bpmn-moddle) property name for the IOMapping.
 *
 * @returns {Object} An Object containing multiple Objects in its `entries` attribute,
 * each representing a properties-panel entry. First entry will always be a collapsible followed
 * by two inputs (one for source and one for target).
 */
export default function(element, translate, options = {}) {
  if(!(is(element, 'bpmn:CallActivity') &&
     options.prop === 'outputParameters')) {
       return []
  }

  const toggle = entryFactory.toggleSwitch(translate, {
    id: `${options.prefix}-propagate-all-toggle`,
    label: translate('Propagate all Child Variables?'),
    modelProperty: 'isActive',
    labelOn: translate('True'),
    labelOff: translate('False'),
    descriptionOn: translate('All variables will be propagated from the child process instance to the parent process instance'),
    isOn: function(element, node) {
        return true;
      },
    get: (element, node) => {
      return { isActive: true };
    },
    set: function(element, values, node) {
      console.log(this);
      console.log(values);
      return {};
    },
    hidden: function(element, node) {
      return false;
    }
  });

  return toggle;

}
