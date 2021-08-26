import { default as React } from "react"
import { connectHierarchicalMenu } from 'react-instantsearch-dom';

const HierarchicalMenu = ({ items, refine, createURL, leaf }) => {
  const className = leaf ? 'px-3' : '';
  return (
    <ul className={className}>
      {items.map((item) => {
        const { label, value, isRefined, count, items } = item;
        return (
          <li key={label}>
            <a
              href={createURL(value)}
              style={{ fontWeight: isRefined ? 'bold' : '' }}
              onClick={event => {
                event.preventDefault();
                refine(value);
              }}
            >
              {label} ({count})
            </a>
            {items && (
              <HierarchicalMenu
                items={items}
                refine={refine}
                createURL={createURL}
                leaf="true"
              />
            )}
          </li>
        );
      })}
    </ul>
  )
};

const hierarchicalMenu = connectHierarchicalMenu(HierarchicalMenu);

export default hierarchicalMenu;
