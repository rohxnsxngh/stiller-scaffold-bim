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
  tab1.setAttribute("aria-label", "Blueprint");
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
  tab2.setAttribute("aria-label", "Extrude");

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
  tab3.setAttribute("aria-label", "Roof");

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
  tab4.setAttribute("aria-label", "Scaffold");

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
  tab5.setAttribute("aria-label", "BOM");

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

  return tablist;
}

export const createTimeline = () => {
  // ... (existing toolbar code)

  // Create a timeline with only icons
  const timeline = document.createElement("ul");
  timeline.className = "timeline";

  const icons = [
    "M10  18a8  8  0  100-16  8  8  0  000  16zm3.857-9.809a.75.75  0  00-1.214-.882l-3.483  4.79-1.88-1.88a.75.75  0  10-1.06  1.061l2.5  2.5a.75.75  0  001.137-.089l4-5.5z",
    "M10  18a8  8  0  100-16  8  8  0  000  16zm3.857-9.809a.75.75  0  00-1.214-.882l-3.483  4.79-1.88-1.88a.75.75  0  10-1.06  1.061l2.5  2.5a.75.75  0  001.137-.089l4-5.5z",
    "M10  18a8  8  0  100-16  8  8  0  000  16zm3.857-9.809a.75.75  0  00-1.214-.882l-3.483  4.79-1.88-1.88a.75.75  0  10-1.06  1.061l2.5  2.5a.75.75  0  001.137-.089l4-5.5z",
    "M10  18a8  8  0  100-16  8  8  0  000  16zm3.857-9.809a.75.75  0  00-1.214-.882l-3.483  4.79-1.88-1.88a.75.75  0  10-1.06  1.061l2.5  2.5a.75.75  0  001.137-.089l4-5.5z",
    "M10  18a8  8  0  100-16  8  8  0  000  16zm3.857-9.809a.75.75  0  00-1.214-.882l-3.483  4.79-1.88-1.88a.75.75  0  10-1.06  1.061l2.5  2.5a.75.75  0  001.137-.089l4-5.5z",
  ];

  icons.forEach((iconPath) => {
    const listItem = document.createElement("li");
    const timelineMiddle = document.createElement("div");
    timelineMiddle.className = "timeline-middle";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0  0  20  20");
    svg.setAttribute("fill", "red");
    svg.setAttribute("class", "w-5 h-5 mx-7");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("d", iconPath);
    path.setAttribute("clip-rule", "evenodd");

    svg.appendChild(path);
    timelineMiddle.appendChild(svg);
    listItem.appendChild(timelineMiddle);

    const hr = document.createElement("hr");

    listItem.appendChild(hr);

    timeline.appendChild(listItem);
  });

  // Append the timeline to the mainToolbar
  // drawer.domElement.appendChild(timeline);
  return timeline;
  // ... (rest of the toolbar code)
};
