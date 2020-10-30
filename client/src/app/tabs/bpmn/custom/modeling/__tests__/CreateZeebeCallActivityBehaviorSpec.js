/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import {
  bootstrapModeler,
  inject
} from 'bpmn-js/test/helper';

import modelingModule from 'bpmn-js/lib/features/modeling';
import coreModule from 'bpmn-js/lib/core';
import contextPadModule from 'bpmn-js/lib/features/context-pad';
import paletteModule from 'bpmn-js/lib/features/palette';

import zeebeModdleExtensions from 'zeebe-bpmn-moddle/resources/zeebe';

import customModelingModule from '..';
import customModules from '../../';

import { getExtensionElements } from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';

import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

describe('features/modeling/behavior - create call activities', function() {

  const testModules = [
    coreModule,
    contextPadModule,
    paletteModule,
    modelingModule,
    customModelingModule,
    customModules
  ];

  const moddleExtensions = {
    zeebe: zeebeModdleExtensions
  };

  const processDiagramXML = require('./process-empty.bpmn');

  beforeEach(bootstrapModeler(processDiagramXML, {
    modules: testModules,
    moddleExtensions
  }));

  it('should execute on shape.create for bpmn:CallActivity', inject(function(canvas,
      modeling, elementFactory) {

    // given
    const rootElement = canvas.getRootElement();

    // when
    const newShape = modeling.createShape({ type: 'bpmn:CallActivity' }, { x: 100, y: 100 }, rootElement);

    // then
    const calledElementExtension = getCalledElement(newShape);

    expect(calledElementExtension).to.exist;
    expect(calledElementExtension.propagateAllChildVariables).to.be.false;
  }));


  it('should not execute on shape.create for bpmn:Task', inject(function(canvas,
      modeling, elementFactory) {

    // given
    const rootElement = canvas.getRootElement();

    // when
    const newShape = modeling.createShape({ type: 'bpmn:Task' }, { x: 100, y: 100 }, rootElement);

    // then
    const calledElementExtension = getCalledElement(newShape);

    expect(calledElementExtension).to.be.undefined;
  }));


});

// helper //////////////////////////

function getCalledElement(element) {
  const bo = getBusinessObject(element);
  const extElement = getExtensionElements(bo, 'zeebe:CalledElement');
  return extElement && extElement[0];
}
