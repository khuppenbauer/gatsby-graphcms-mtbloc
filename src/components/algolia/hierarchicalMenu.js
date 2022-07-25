import { default as React } from "react"
import { useHierarchicalMenu } from 'react-instantsearch-hooks-web';

const HierarchicalMenuItems = ({ 
  items, refine, createURL, leaf 
}) => {
  const className = leaf ? 'px-3' : '';
  return (
    <ul className={className}>
      {items.map((item) => {
        const { label, value, isRefined, count, data } = item;
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
            {data && (
              <HierarchicalMenuItems
                items={data}
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

const HierarchicalMenu = (props) => {
  const {
    items,
    refine,
    createURL,
  } = useHierarchicalMenu(props);
  return (
    <HierarchicalMenuItems 
      items={items}
      refine={refine}
      createURL={createURL}
    />
  );
}

export default HierarchicalMenu;
