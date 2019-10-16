const fp = require("fastify-plugin");
module.exports = fp(function (fastify, opts, next) {
  const Utils = {
    shuffle: a => {
      a.sort(() => Math.random() - 0.5);
      return a;
    },

    random: (min, max) => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },

    genCode: () => {
      return Utils.random(100000, 999999);
    },

    time: () => {
      return (Date.now() / 1000) | 0;
    },

    hasAll: (a, b) => {
      return Utils.difference(a, b).length === 0;
    },

    difference: (b, a) => {
      const s = new Set(b);
      return a.filter(x => !s.has(x));
    },

    orderBy: (arr, props, orders) =>
      [...arr].sort((a, b) =>
        props.reduce((acc, prop, i) => {
          if (acc === 0) {
            const [p1, p2] = orders && orders[i] === 'desc' ? [b[prop], a[prop]] : [a[prop], b[prop]];
            acc = p1 > p2 ? 1 : p1 < p2 ? -1 : 0;
          }
          return acc;
        }, 0)
      ),

    transform: (object) => {
      if (object === null)
        return null;
      if (Array.isArray(object)) {
        for (let index in object) {
          object[index] = object[index].toObject();
        }
      }
      return object;
    },
    getNoun(number, one, two, five) {
      number = Math.abs(number);
      number %= 100;
      if (number >= 5 && number <= 20) {
        return five;
      }
      number %= 10;
      if (number === 1) {
        return one;
      }
      if (number >= 2 && number <= 4) {
        return two;
      }
      return five;
    },
    getCoordinateBorders: (lat, lon, radius) => {
      return [
        [lat - radius / 111, lat + radius / 111],
        [lon - (radius * 2) / 111, lon + (radius * 2) / 111]
      ];
    },
  };
  fastify.decorate("utils", Utils);
  next()
});