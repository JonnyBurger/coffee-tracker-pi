import { Gpio } from "onoff";
import got from "got";
import debounce from "lodash/debounce";

enum Color {
  WHITE,
  BLUE,
  BLACK
}

type Press = {
  color: Color;
  timestamp: number;
};

type Combo = {
  keys: Color[];
  action: () => void;
};

const addCoffee = (slug: string) => {
  got(`https://increment.build/axelra-coffee-89fds7n98f${slug}`)
    .then(() => console.log("incremented", slug))
    .catch(err => console.log(err));
};

const combos: Combo[] = [
  {
    keys: [Color.BLUE, Color.BLUE, Color.BLUE],
    action: () => addCoffee("peach")
  },
  {
    keys: [Color.BLACK, Color.BLACK, Color.BLACK],
    action: () => addCoffee("tom")
  },
  {
    keys: [Color.WHITE, Color.WHITE, Color.WHITE],
    action: () => addCoffee("lucas")
  },
  {
    keys: [Color.BLUE, Color.BLACK, Color.WHITE],
    action: () => addCoffee("severin")
  },
  {
    keys: [Color.WHITE, Color.BLACK, Color.BLUE],
    action: () => addCoffee("jonny")
  },
  {
    keys: [Color.BLACK, Color.BLUE, Color.WHITE],
    action: () => addCoffee("jonas")
  },
  {
    keys: [Color.WHITE, Color.BLUE, Color.BLACK],
    action: () => addCoffee("calvin")
  },
  {
    keys: [Color.BLACK, Color.WHITE, Color.BLACK],
    action: () => addCoffee("david")
  },
  {
    keys: [Color.WHITE, Color.WHITE, Color.BLUE],
    action: () => addCoffee("nico")
  },
  {
    keys: [Color.BLACK, Color.WHITE, Color.BLUE],
    action: () => addCoffee("ile")
  },
  {
    keys: [Color.BLUE, Color.WHITE, Color.BLUE],
    action: () => addCoffee("fra")
  },
  {
    keys: [Color.WHITE, Color.BLACK, Color.WHITE],
    action: () => addCoffee("daniela")
  },
  {
    keys: [Color.BLUE, Color.BLUE, Color.BLACK],
    action: () => addCoffee("manuel-g")
  },
  {
    keys: [Color.BLACK, Color.BLACK, Color.WHITE],
    action: () => addCoffee("manuel-h")
  },
  {
    keys: [Color.WHITE, Color.WHITE, Color.BLACK],
    action: () => addCoffee("moflix")
  },
  {
    keys: [Color.BLACK, Color.BLACK, Color.WHITE],
    action: () => addCoffee("livealytics")
  },
  {
    keys: [Color.WHITE, Color.BLACK, Color.BLACK],
    action: () => addCoffee("sibex")
  },
  {
    keys: [Color.BLUE, Color.BLUE, Color.WHITE],
    action: () => addCoffee("fqx")
  }
];

const evaluateCombo = debounce(() => {
  for (const combo of combos) {
    const lastN = presses.slice(0 - combo.keys.length);
    const timeRange = lastN[lastN.length - 1].timestamp - lastN[0].timestamp;
    const timeSinceLastPress =
      presses[presses.length - 1].timestamp -
      (presses.length > combo.keys.length
        ? presses[presses.length - combo.keys.length - 1].timestamp
        : 0);

    if (
      lastN.map(p => p.color).join() === combo.keys.join() &&
      timeRange < 5000 &&
      timeSinceLastPress > 2000
    ) {
      console.log({ timeRange, timeSinceLastPress });
      combo.action();
    }
  }
}, 1000);

const presses: Press[] = [];

for (const index of [4, 9, 14]) {
  const button = new Gpio(index, "in", "both");
  const color =
    index === 4 ? Color.BLACK : index === 9 ? Color.BLUE : Color.WHITE;
  let prevValue = 0;
  let prevTimestamp = Date.now();
  button.watch((err, value) => {
    const buttonUp = Date.now() - prevTimestamp;
    if (prevValue && !value && buttonUp > 0) {
      console.log(color, "pressed");
      presses.push({
        color,
        timestamp: Date.now()
      });
      evaluateCombo();
    }
    prevValue = value;
    prevTimestamp = Date.now();
  });
}
