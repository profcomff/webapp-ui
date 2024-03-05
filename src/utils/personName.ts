interface GetNameWithInitialsArgs {
	firstName: string;
	middleName: string;
	lastName: string;
}

export const getNameWithInitials = ({
	firstName,
	middleName,
	lastName,
}: GetNameWithInitialsArgs) => {
	return `${lastName} ${firstName[0]}. ${middleName[0]}.`;
};
