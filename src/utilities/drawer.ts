

  // Example usage of the createDropdown function
  // const dropdownItems = ["Item  1", "Item  2"];
  // const dropdown = createDropdown("Hover", dropdownItems);
  // drawer.domElement.appendChild(dropdown);
export function createDropdown(buttonText: string, items: string[]): HTMLElement {
  // Create the outer div with the dropdown class
  const dropdownDiv = document.createElement("div");
  dropdownDiv.className = "dropdown";

  // Create the button that triggers the dropdown
  const button = document.createElement("summary");
  button.tabIndex = 0;
  button.setAttribute("role", "button");
  button.className = "btn btn-sm w-5/6 ml-6";
  button.textContent = buttonText;
  dropdownDiv.appendChild(button);

  // Create the unordered list for the dropdown content
  const ul = document.createElement("ul");
  ul.tabIndex = 0;
  ul.className =
    "dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-5/6 ml-6";

  // Create list items with links based on the items array
  items.forEach((itemText) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = itemText;
    li.appendChild(a);
    ul.appendChild(li);
  });

  // Append the unordered list to the outer div
  dropdownDiv.appendChild(ul);

  return dropdownDiv;
}

export function createCollapse(title: string, content: string): HTMLElement {
  // Create the outer div with the collapse class
  const collapseDiv = document.createElement("div");
  collapseDiv.className = "collapse bg-base-200";

  // Create the checkbox input
  const checkboxInput = document.createElement("input");
  checkboxInput.type = "checkbox";
  collapseDiv.appendChild(checkboxInput);

  // Create the collapse title div
  const collapseTitleDiv = document.createElement("div");
  collapseTitleDiv.className = "collapse-title text-xl font-medium";
  collapseTitleDiv.textContent = title;
  collapseDiv.appendChild(collapseTitleDiv);

  // Create the collapse content div
  const collapseContentDiv = document.createElement("div");
  collapseContentDiv.className = "collapse-content";
  const paragraph = document.createElement("p");
  paragraph.textContent = content;
  collapseContentDiv.appendChild(paragraph);
  collapseDiv.appendChild(collapseContentDiv);

  return collapseDiv;
}

export function createSelect(options: string[], defaultOptionText: string = 'Default'): HTMLElement {
  // Create the select element with the specified class
  const selectElement = document.createElement('select');
  selectElement.className = 'select select-danger bg-black select-ghost w-full max-w-xs';

  // Create the default disabled option
  const defaultOption = document.createElement('option');
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = defaultOptionText;
  selectElement.appendChild(defaultOption);

  // Create and append the other options based on the options array
  options.forEach(optionText => {
    const option = document.createElement('option');
    option.textContent = optionText;
    option.className = "bg-black font-semibold hover:bg-red-200 "
    selectElement.appendChild(option);
  });

  return selectElement;
}
