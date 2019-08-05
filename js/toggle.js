function toggleSiteTheme(scheme) {
  var theme = scheme == "dark" ? "dark-mode" : "light-mode";
  const bodyClasses = document.body.classList;
  const dmToggleState = document.getElementById("dark-toggle-state");
  const moon = document.getElementsByClassName("moon")[0];
  const sun = document.getElementsByClassName("sun")[0];

  if (theme == "dark-mode") {
    bodyClasses.add(theme);
    bodyClasses.remove("light-mode");
    moon.classList.add("hidden");
    sun.classList.remove("hidden");
    dmToggleState.setAttribute("checked", "checked");
    return;
  } else if (theme == "light-mode") {
    bodyClasses.add(theme);
    bodyClasses.remove("dark-mode");
    moon.classList.remove("hidden");
    sun.classList.add("hidden");
    dmToggleState.removeAttribute("checked");
    return;
  }
}

function siteVsSystemTheme(systemTheme) {
  if (document.cookie.indexOf("darkMode") > 0) {
    console.log("You've set the site dark theme before. Using that now.");
    toggleSiteTheme("dark");
  } else if (document.cookie.indexOf("lightMode") > 0) {
    console.log("You've set the site light theme before. Using that now.");
    toggleSiteTheme("light");
  } else if (systemTheme["lightMode"] == true) {
    console.log("No theme defined for site but light theme defined for system. Setting light theme.");
    toggleSiteTheme("light");
  } else if (systemTheme["darkMode"] == true) {
    console.log("No theme defined for site but dark theme defined for system. Setting dark theme.");
    toggleSiteTheme("dark");
  } else {
    console.log("No theme defined for site or system. Setting light theme as standard.");
    toggleSiteTheme("light");
  }
}

//IIFE with variable name
var systemColorPreference = (function sysColorPreference(listeners) {
  //Cache media query value for re-use (saves multiple calls)
  const lightMQ = window.matchMedia("(prefers-color-scheme: light)");
  const darkMQ = window.matchMedia("(prefers-color-scheme: dark)");
  const noprefMQ = window.matchMedia("(prefers-color-scheme: no-preference)");

  //Check whether system theme has been defined
  var lightPreferred = lightMQ.matches;
  var darkPreferred = darkMQ.matches;
  var noPreference = noprefMQ.matches;
  var noSupport = !darkPreferred && !lightPreferred && !noPreference;

  //Collect system theme preference as an object
  var prefers = {
    "lightMode": lightPreferred,
    "darkMode": darkPreferred,
    "nopreference": noPreference,
    "unsupported": noSupport
  };

  //Compare system and site them and add [event] listeners as required
  if (!listeners) {
    //Check system theme compared to current site theme
    console.log("Checking system theme...");
    siteVsSystemTheme(prefers);
    //Add [event] listeners
    lightMQ.addListener(e => e.matches && sysColorPreference(true));
    darkMQ.addListener(e => e.matches && sysColorPreference(true));
    noprefMQ.addListener(e => e.matches && sysColorPreference(true));
    console.log("Setting up new system theme listeners..."); //Debugging, not required
  } else {
    //Check system theme - [event] listeners already exist
    console.log("System theme changed...");
    siteVsSystemTheme(prefers);
  }

  //Update the IIFE variable value to store theme and listener status
  systemColorPreference = prefers;

  //Return the "prefers" object, for use in other functions/elsewhere
  return prefers;
})();


function darkToggleDefault() {
  const bodyClasses = document.body.classList;
  const dmToggle = document.getElementById("dark-toggle-floating-action");
  var cookie = {
    get: function(cookiename) {
      if (document.cookie.indexOf(cookiename + "=true") == -1) {
        return false;
      } else {
        return true;
      }
    },
    set: function(cookiename) {
      var now = new Date();
      var time = now.getTime();
      var expireTime = time + 365 * 24 * 60 * 60 * 1000;
      var expireDate = new Date(expireTime);
      document.cookie = cookiename + "=true;expires=" + expireDate + ";path=/";
    },
    remove: function(cookiename) {
      if (this.get(cookiename) === true) {
      var current = new Date();
      var currentTime = current.getTime();
      var removeExpireTime = currentTime - 365 * 24 * 60 * 60 * 1000;
      var removeExpireDate = new Date(removeExpireTime);
        document.cookie = cookiename + "=;expires=" + removeExpireDate + ";path=/";
      } else {
        return;
      }
    }
  };

  //Hide toggle until page is loaded
  dmToggle.removeAttribute("style");

  dmToggle.addEventListener("click", () => {
   if (cookie.get("darkMode") === true || bodyClasses.contains("dark-mode")) {
     toggleSiteTheme("light");
     cookie.remove("darkMode");
     cookie.set("lightMode");
     console.log("Changing to light theme!");
   } else {
     toggleSiteTheme("dark");
     cookie.remove("lightMode");
     cookie.set("darkMode");
     console.log("Changing to dark theme!");
   }
  });
}
document.addEventListener("load", darkToggleDefault());
