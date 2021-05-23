const _ = require("lodash");

var id3 = function (_s, target, features) {
  var targets = _.unique(_s.pluck(target).value());
  if (targets.length == 1) {
    console.log("end node! " + targets[0]);
    return {
      type: "result",
      val: targets[0],
      name: targets[0],
      alias: targets[0] + randomTag(),
    };
  }
  if (features.length == 0) {
    console.log("returning the most dominate feature!!!");
    var topTarget = mostCommon(_s.pluck(target).value());
    return {
      type: "result",
      val: topTarget,
      name: topTarget,
      alias: topTarget + randomTag(),
    };
  }
  var bestFeature = maxGain(_s, target, features);
  var remainingFeatures = _.without(features, bestFeature);
  var possibleValues = _.unique(_s.pluck(bestFeature).value());
  console.log("node for " + bestFeature);
  var node = { name: bestFeature, alias: bestFeature + randomTag() };
  node.type = "feature";
  node.vals = _.map(possibleValues, function (v) {
    console.log("creating a branch for " + v);
    var _newS = _(
      _s.filter(function (x) {
        return x[bestFeature] == v;
      })
    );
    var child_node = { name: v, alias: v + randomTag(), type: "feature_value" };
    child_node.child = id3(_newS, target, remainingFeatures);
    return child_node;
  });
  return node;
};

var predict = function (id3Model, sample) {
  var root = id3Model;
  while (root.type != "result") {
    var attr = root.name;
    var sampleVal = sample[attr];
    var childNode = _.detect(root.vals, function (x) {
      return x.name == sampleVal;
    });
    root = childNode.child;
  }
  return root.val;
};

//necessary math functions

var entropy = function (vals) {
  var uniqueVals = _.unique(vals);
  var probs = uniqueVals.map(function (x) {
    return prob(x, vals);
  });
  var logVals = probs.map(function (p) {
    return -p * log2(p);
  });
  return logVals.reduce(function (a, b) {
    return a + b;
  }, 0);
};

var gain = function (_s, target, feature) {
  var attrVals = _.unique(_s.pluck(feature));
  var setEntropy = entropy(_s.pluck(target));
  var setSize = _s.size();
  var entropies = attrVals.map(function (n) {
    var subset = _s.filter(function (x) {
      return x[feature] === n;
    });
    return (subset.length / setSize) * entropy(_.pluck(subset, target));
  });
  var sumOfEntropies = entropies.reduce(function (a, b) {
    return a + b;
  }, 0);
  return setEntropy - sumOfEntropies;
};

var maxGain = function (_s, target, features) {
  return _.max(features, function (e) {
    return gain(_s, target, e);
  });
};

var prob = function (val, vals) {
  var instances = _.filter(vals, function (x) {
    return x === val;
  }).length;
  var total = vals.length;
  return instances / total;
};

var log2 = function (n) {
  return Math.log(n) / Math.log(2);
};

var mostCommon = function (l) {
  return _.sortBy(l, function (a) {
    return count(a, l);
  }).reverse()[0];
};

var count = function (a, l) {
  return _.filter(l, function (b) {
    return b === a;
  }).length;
};

var randomTag = function () {
  return "_r" + Math.round(Math.random() * 1000000).toString();
};

var bayesNumberProb = function (_s, target, currentTarget, column) {
  const allNumbers = _.pluck(
    _.filter(_s.value(), (elem) => {
      return elem[target] === currentTarget;
    }),
    column[0]
  );
  const mean = _.sum(allNumbers) / allNumbers.length;

  let segma = 0;
  allNumbers.forEach((num) => {
    segma += (num - mean) * (num - mean);
  });
  segma /= allNumbers.length;

  let ans =
    (1 / Math.sqrt(Math.PI * 2 * segma)) *
    Math.exp((column[1] - mean) / (2 * segma));
  return ans;
};

var bayesNotNumberProb = function (_s, target, currentTarget, column) {
  const subSet = _.filter(_s.value(), (elem) => {
    return elem[target] === currentTarget && elem[column[0]] === column[1];
  });
  return subSet.length;
};

var bayes = function (_s, target, feature, query) {
  let columnsType = {};
  feature.forEach((elem) => {
    const getFirstCell = _s.pluck(elem).value()[0];
    if (_.isNumber(getFirstCell)) {
      columnsType = { ...columnsType, [elem]: true };
    } else columnsType = { ...columnsType, [elem]: false };
  });

  const targets = _.uniq(_s.pluck(target).value());
  let targetsCount = {};
  targets.forEach((elem) => {
    targetsCount = {
      ...targetsCount,
      [elem]: count(elem, _s.pluck(target).value()),
    };
  });
  let answers = {};
  targets.forEach((currentTarget) => {
    let ans = 1;
    Object.entries(query).forEach((column) => {
      if (columnsType[column[0]]) {
        ans *= bayesNumberProb(_s, target, currentTarget, column);
      } else {
        ans *=
          bayesNotNumberProb(_s, target, currentTarget, column) /
          targetsCount[currentTarget];
      }
    });

    answers = { ...answers, [currentTarget]: ans };
  });
  let ans = -109,
    res;
  targets.forEach((currentTarget) => {
    if (ans < answers[currentTarget]) {
      (ans = answers[currentTarget]), (res = currentTarget);
    }
  });
  return res;
};

module.exports = { id3, bayes };
