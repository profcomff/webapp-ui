interface GetNameWithInitialsArgs {
	first_name: string;
	middle_name: string;
	last_name: string;
}

export const getNameWithInitials = ({
	first_name,
	middle_name,
	last_name,
}: GetNameWithInitialsArgs) => {
	return `${last_name} ${first_name[0]}. ${middle_name[0]}.`;
};
