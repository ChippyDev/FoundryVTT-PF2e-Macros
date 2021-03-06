if (game.user.targets.size == 0) {
  ui.notifications.warn('You must have an actor targeted.');
  return;
}

const targetid = game.user.targets.values().next().value.data._id;
const targetCombat = game.combat.combatants.find((c) => c.tokenId === targetid);

if (targetCombat == undefined) {
  ui.notifications.warn('Target isnt in combat');
  return;
}

const applyChanges = ($html) => {
  const damage = $html.find('[name="damage"]').val() || 0;
  const type = $html.find('[name="type"]')[0].value || 'null';
  console.log(type)
  if (damage == 0) return;

  const alertData = {
    name: `${targetid}:${type}`,
    label: `GM DoT ${type}`,
    round: 0,
    roundAbsolute: false,
    turnId: targetCombat._id,
    endOfTurn: true,
    repeating: {
      frequency: 1,
    },
    args: [targetid, damage, type],
    macro: 'Effect Tick',
  };

  TurnAlert.create(alertData);
  game.macros.getName('Toggle Effect Icon').execute(targetid, type, true);
};

const dialog = new Dialog({
  title: 'Enter Damage Formula',
  content: `
<form>
<div class="form-group">
<label>Amount:</label>
<input id="damage" name="damage" type="string"/>
</div>
<div class="form-group">
<label>Type:</label>
<select id="type" name="type">
<option value="bleed">Bleed</option>
<option value="acid">Acid</option>
<option value="fire">Fire</option>
<option value="fast-healing">Fast healing</option>
<option value="regen">Regen</option>
</select>
</div>
</form>
`,
  buttons: {
    yes: {
      icon: `<i class="fas fa-check"></i>`,
      label: 'Apply',
      callback: applyChanges,
    },
    no: {
      icon: `<i class="fas fa-times"></i>`,
      label: 'Cancel',
    },
  },
  default: 'no',
});
dialog.render(true);
