class MasterTomNLFactionSheet5e extends dnd5e.applications.actor.ActorSheet5eCharacter {
  constructor(...args) {
    super(...args);

    /**
     * Track the set of item filters which are applied
     * @type {Set}
     */
    this._filters = {
      inventory: new Set(),
      spellbook: new Set(),
      features: new Set(),
      actions: new Set()
    };
  }


  get template() {
    if (!game.user.isGM && this.actor.limited) return "systems/dnd5e/templates/actors/limited-sheet.hbs";
    return "modules/mastertomnl-faction-sheet/template/mastertomnl-faction-sheet.html";
  }

  static get defaultOptions() {
    const options = super.defaultOptions;

    mergeObject(options, {
      classes: ["dnd5e", "sheet", "actor", "character", "dndbcs"],
      width: 1220,
      height: 940,
      blockActionsTab: true
    });
    return options;
  }

  /**
   * Iinitialize Item list filters by activating the set of filters which are currently applied
   * @private
   */
  _initializeFilterItemList(i, ul) {
    const set = this._filters[ul.dataset.filter];
    const filters = ul.querySelectorAll(".filter-item");
    for (let li of filters) {
      if (set.has(li.dataset.filter)) li.classList.add("active");
    }
  }


  /* -------------------------------------------- */

  async getData() {
    const sheetData = await super.getData();

    // Resources
    sheetData["resources"] = ["primary", "secondary", "tertiary"].reduce((arr, r) => {
      const res = sheetData.system.resources[r] || {};
      res.name = r;
      res.placeholder = game.i18n.localize("DND5E.Resource" + r.titleCase());
      if (res && res.value === 0) delete res.value;
      if (res && res.max === 0) delete res.max;
      return arr.concat([res]);
    }, []);

    // Experience Tracking
    sheetData["disableExperience"] = game.settings.get("dnd5e", "disableExperienceTracking");

    console.log("MasterTomNL-Faction-Sheet-5e | sheetData", sheetData);

    return sheetData;
  }


}

Hooks.once('init', async function () {

  Handlebars.registerHelper('ifeq', function (a, b, options) {
    if (a == b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  Handlebars.registerHelper('ifnoteq', function (a, b, options) {
    if (a != b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  console.log("MasterTomNL-Faction-Sheet-5e | Loaded");

  Actors.registerSheet('dnd5e', MasterTomNLFactionSheet5e, {
    types: ['character'],
    makeDefault: false
  });

});
