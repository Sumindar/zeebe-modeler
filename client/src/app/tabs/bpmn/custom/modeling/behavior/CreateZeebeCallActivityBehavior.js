/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is } from 'bpmn-js/lib/util/ModelUtil';

const HIGH_PRIORITY = 15000;

/**
 * BPMN specific create zeebe call activity behavior
 */
export default function CreateZeebeCallActivityBehavior(
    eventBus, bpmnFactory, modeling) {

  CommandInterceptor.call(this, eventBus);

  /**
   * add a zeebe:calledElement extensionElement with
   * propagateAllChildVariables attribute = false when creating
   * a bpmn:callActivity
   */
  this.postExecuted('shape.create', HIGH_PRIORITY, function(context) {
    const {
      shape
    } = context;

    if (!is(shape, 'bpmn:CallActivity')) {
      return;
    }

    const attrs = {
      propagateAllChildVariables: false
    };

    const extensionElements = shape.businessObject.get('extensionElements') ||
      bpmnFactory.create('bpmn:ExtensionElements');

    extensionElements.get('values').push(
      bpmnFactory.create('zeebe:CalledElement', attrs)
    );

    modeling.updateProperties(shape, {
      extensionElements: extensionElements
    });

  }, true);
}


CreateZeebeCallActivityBehavior.$inject = [
  'eventBus',
  'bpmnFactory',
  'modeling'
];

inherits(CreateZeebeCallActivityBehavior, CommandInterceptor);
