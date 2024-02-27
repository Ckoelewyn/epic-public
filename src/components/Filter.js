import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { makeStyles } from "tss-react/mui";

import { Dropdown } from "@mui/base/Dropdown";
import { Menu } from "@mui/base/Menu";
import { MenuButton } from "@mui/base/MenuButton";
import { MenuItem } from "@mui/base/MenuItem";
import Checkbox from "@mui/material/Checkbox";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const useStyles = makeStyles()((theme, { width }) => ({
	filter: {
		color: "white",
		flex: 1,
	},
	menuButton: {
		alignItems: "center",
		background: theme.palette.common.white,
		color: theme.palette.grey.dark,
		display: "flex",
		fontSize: "1rem",
		fontWeight: 700,
		justifyContent: "space-between",
		minWidth: "15rem",
		width: "100%",
		"& >div": {
			alignItems: "center",
			display: "flex",
			gap: "1rem",
		},
		"& svg": {
			height: "1.875rem",
			width: "1.875rem",
		},
		"&:disabled": {
			opacity: 0.7,
		},
	},
	menu: {
		background: theme.palette.common.white,
		boxShadow: "2px 6px 8px 0px #0000001A",
		width: width,
		"& ul": {
			listStyleType: "none",
			margin: 0,
			padding: 0,
		},
	},
	menuItem: {
		alignItems: "center",
		cursor: "pointer",
		display: "flex",
	},
}));

const Filter = ({ icon, items = [], onChange, selected, title }) => {
	const [keys, setKeys] = useState(selected.map(({ key }) => key));
	const [open, setOpen] = useState(false);
	const [width, setWidth] = useState(0);

	const { classes } = useStyles({ width });

	const disabled = !items.length;

	const keysRef = useRef(selected);
	const selectedRef = useRef(selected);

	const menuButtonRef = useCallback((node) => {
		if (!node) return;
		setWidth(node.clientWidth);
	}, []);

	useEffect(() => {
		if (selectedRef.current.length === selected.length) return;
		selectedRef.current = selected;

		if (keysRef.current.length === selected.length) return;

		setKeys(selected.map(({ key }) => key));
	}, [selected]);

	useEffect(() => {
		if (keysRef.current.length === keys.length) return;
		keysRef.current = keys;

		if (selectedRef.current.length === keys.length) return;

		onChange(items.filter(({ key }) => keys.includes(key)));
	}, [items, keys, onChange]);

	const onSelect = (key) =>
		setKeys((keys) => (keys.includes(key) ? keys.filter((val) => val !== key) : [...keys, key]));

	const onToggle = () => setOpen((val) => !val);

	return (
		<div className={classes.filter}>
			<Dropdown open={open}>
				<MenuButton
					aria-label={`Select ${title}`}
					className={classes.menuButton}
					disabled={disabled}
					onClick={onToggle}
					ref={menuButtonRef}
				>
					<div>
						{icon && <div>{icon}</div>}
						<div>{title}</div>
					</div>
					{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
				</MenuButton>
				<Menu className={classes.menu}>
					{items.map(({ description, key }) => (
						<MenuItem
							className={classes.menuItem}
							key={key}
							onClick={() => onSelect(key)}
							onKeyDown={({ code }) => code === "Escape" && onToggle()}
						>
							<Checkbox checked={keys.includes(key)} />
							{description}
						</MenuItem>
					))}
				</Menu>
			</Dropdown>
		</div>
	);
};

Filter.propTypes = {
	icon: PropTypes.element,
	items: PropTypes.arrayOf(PropTypes.object).isRequired,
	onChange: PropTypes.func.isRequired,
	selected: PropTypes.arrayOf(PropTypes.object).isRequired,
	title: PropTypes.string.isRequired,
};

export default Filter;
