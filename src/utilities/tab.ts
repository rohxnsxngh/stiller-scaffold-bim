export function createTabs() {
      // Create the tablist container
  const tablist = document.createElement("div");
  tablist.setAttribute("role", "tablist");
  tablist.classList.add("tabs", "tabs-bordered", "tab-xs");

  // Create the first tab
  const tab1 = document.createElement("input");
  tab1.setAttribute("type", "radio");
  tab1.setAttribute("name", "my_tabs_2");
  tab1.setAttribute("role", "tab");
  tab1.setAttribute("class", "tab");
  tab1.setAttribute("aria-label", "Tab  1");
  tab1.setAttribute("checked", "");

  const tabContent1 = document.createElement("div");
  tabContent1.setAttribute("role", "tabpanel");
  tabContent1.classList.add(
    "tab-content",
    "bg-base-100",
    "border-base-300",
    "rounded-box",
    "p-6",
    "h-screen"
  );
  tabContent1.textContent = "Tab content  1";

  // Create the second tab
  const tab2 = document.createElement("input");
  tab2.setAttribute("type", "radio");
  tab2.setAttribute("name", "my_tabs_2");
  tab2.setAttribute("role", "tab");
  tab2.setAttribute("class", "tab");
  tab2.setAttribute("aria-label", "Tab  2");

  const tabContent2 = document.createElement("div");
  tabContent2.setAttribute("role", "tabpanel");
  tabContent2.classList.add(
    "tab-content",
    "bg-base-100",
    "border-base-300",
    "rounded-box",
    "p-6",
    "h-screen"
  );
  tabContent2.textContent = "Tab content  2";

  // Create the third tab
  const tab3 = document.createElement("input");
  tab3.setAttribute("type", "radio");
  tab3.setAttribute("name", "my_tabs_2");
  tab3.setAttribute("role", "tab");
  tab3.setAttribute("class", "tab");
  tab3.setAttribute("aria-label", "Tab  3");

  const tabContent3 = document.createElement("div");
  tabContent3.setAttribute("role", "tabpanel");
  tabContent3.classList.add(
    "tab-content",
    "bg-base-100",
    "border-base-300",
    "rounded-box",
    "p-6",
    "h-screen"
  );
  tabContent3.textContent = "Tab content  3";

  // Create the fourth tab
  const tab4 = document.createElement("input");
  tab4.setAttribute("type", "radio");
  tab4.setAttribute("name", "my_tabs_2");
  tab4.setAttribute("role", "tab");
  tab4.setAttribute("class", "tab");
  tab4.setAttribute("aria-label", "Tab  4");

  const tabContent4 = document.createElement("div");
  tabContent4.setAttribute("role", "tabpanel");
  tabContent4.classList.add(
    "tab-content",
    "bg-base-100",
    "border-base-300",
    "rounded-box",
    "p-6",
    "h-screen"
  );
  tabContent4.textContent = "Tab content  4";

    // Create the fourth tab
    const tab5 = document.createElement("input");
    tab5.setAttribute("type", "radio");
    tab5.setAttribute("name", "my_tabs_2");
    tab5.setAttribute("role", "tab");
    tab5.setAttribute("class", "tab");
    tab5.setAttribute("aria-label", "Tab  5");
  
    const tabContent5 = document.createElement("div");
    tabContent5.setAttribute("role", "tabpanel");
    tabContent5.classList.add(
      "tab-content",
      "bg-base-100",
      "border-base-300",
      "rounded-box",
      "p-6",
      "h-screen"
    );
    tabContent5.textContent = "Tab content  5";

  // Append the tabs and their content to the tablist
  tablist.appendChild(tab1);
  tablist.appendChild(tabContent1);
  tablist.appendChild(tab2);
  tablist.appendChild(tabContent2);
  tablist.appendChild(tab3);
  tablist.appendChild(tabContent3);
  tablist.appendChild(tab4);
  tablist.appendChild(tabContent4);
  tablist.appendChild(tab5);
  tablist.appendChild(tabContent5);

  return tablist
}