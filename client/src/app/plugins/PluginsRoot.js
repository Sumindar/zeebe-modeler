/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import debug from 'debug';

import React, { PureComponent } from 'react';

import PluginParent from './PluginParent';

const log = debug('app:plugins');


export default class PluginsRoot extends PureComponent {

  constructor(props) {

    super(props);

    const {
      app,
      plugins
    } = props;

    // this is non-reactive, by design
    this.pluginsAndSubscribers = plugins.map(plugin => {

      const subscriber = createSubscriber(app);
      const name = plugin.displayName || plugin.name;

      return {
        name,
        plugin,
        subscriber
      };
    });

  }

  render() {

    const {
      app
    } = this.props;

    const {
      pluginsAndSubscribers
    } = this;

    return pluginsAndSubscribers.map((pluginAndSubscriber, index) => {

      const {
        name,
        plugin: PluginComponent,
        subscriber
      } = pluginAndSubscriber;

      const {
        cancelAll,
        subscribe
      } = subscriber;

      log('render plug-in', name);

      return (
        <PluginParent
          key={ name || index }
          name={ name || index }
          cancelSubscriptions={ cancelAll }
          onError={ app.handleError }
        >
          <PluginComponent
            triggerAction={ app.triggerAction }
            subscribe={ subscribe }
            log={ app.composeAction('log') }
          />
        </PluginParent>
      );
    });
  }
}



// helpers ////////////

function createSubscriber(app) {
  let subscriptions = [];

  function subscribe(event, callback) {

    const subscription = {
      cancel
    };

    function cancel() {
      subscriptions = without(subscriptions, subscription);

      app.off(event, callback);
    }

    app.on(event, callback);

    subscriptions = [ ...subscriptions, subscription ];

    return subscription;
  }


  function cancelAll() {
    subscriptions.forEach(subscription => subscription.cancel());
  }

  return {
    cancelAll,
    subscribe
  };
}

function without(arrayLike, element) {
  return arrayLike.filter(currentElement => currentElement !== element);
}