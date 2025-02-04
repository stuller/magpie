import * as React from 'react';
import {
    Button,
    CircularProgress,
    FormControl,
    Grid2,
    IconButton, Input,
    TextField,
    Typography
} from "@mui/material";
import {useParams} from 'react-router-dom';
import {IProject} from "./Projects.tsx";
import {Cancel, CloudUpload, Edit, Save} from "@mui/icons-material";
import {VisuallyHiddenInput} from "../../utils/image-utils.ts";
import {getUrl, uploadData} from "aws-amplify/storage";
import {a} from "@aws-amplify/backend";

interface IProps {
    client: any
}

const Project:React.FC<IProps> = (props:IProps) => {
    const {client} = props;
    const {id} = useParams();
    const [isLoading, setIsLoading] = React.useState(false);
    const [project, setProject] = React.useState<IProject>();
    const [savedProject, setSavedProject] = React.useState<IProject>();
    const [error, setError] = React.useState<string>();
    const [isEditMode, setIsEditMode] = React.useState<boolean>(false);
    const [imageFile, setImageFile] = React.useState<File>();

    React.useEffect(() => {
        (async () => {
            setIsLoading(true);
            await fetchProject();
            setIsLoading(false);
        })()

    }, []);


    const fetchProject = async () => {
        try {
            const { data: project, errors } = await client.models.Project.get({id});
            if(project) {
                const linkToStorageFile = await getUrl({
                    path: ({ identityId }) => `media/${identityId}/${project.image}`,
                });
                setProject({...project, image: linkToStorageFile.url});
                setSavedProject(project);
                console.log({project})

            }
            if(errors) {
                console.log(errors)
                setError('oops');
            }
        } catch {
            setError('oops, something went wrong')
            //todo make errors prettier
        }
    }

    const handleSave = async () => {
        if(project) {
            const {name, description, labor, laborCost, price, units, supplies} = project
            console.log(project.image)
            const projectUpdate = {
                id,
                name,
                description,
                labor,
                laborCost,
                price,
                units,
                supplies,
                image: imageFile?.name
            }

            try {
                console.log({...projectUpdate})
                const {data: updatedSupply} = await client.models.Project.update(projectUpdate);
                console.log({updatedSupply})
                if (updatedSupply?.image && imageFile) {
                    let foo = await uploadData({
                        path: ({identityId}) => `media/${identityId}/${updatedSupply.image}`,
                        data: imageFile,
                    }).result;
                    console.log({foo})
                            handleEditModeToggle();
                            return fetchProject();
                }
            } catch (err) {
                console.log(err);
            }

            //todo - remove items that are not in schema
            // client.models.Project.update(projectUpdate)
            //     .then(async (updatedSupply) => {
            //         console.log({updatedSupply, imageFile})
            //         if (updatedSupply?.data?.image && imageFile) {
            //             console.log('HEY')
            //             const foo = await uploadData({
            //                 path: ({identityId}) => `media/${identityId}/${updatedSupply.image}`,
            //                 data: imageFile,
            //             }).result;
            //             console.log(foo)
            //         }
            //         handleEditModeToggle();
            //         return fetchProject();
            //     })
            //     .catch((err) => {
            //         console.log(err)
            //     })
        }
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files) {
            setImageFile(event.target.files[0]);
        }
    }

    const handleInputChange = (e) => {
        const field = e.target.name;
        const updatedProject = {...project};
        // @ts-ignore
        updatedProject[field] = e.target.value;

        if(field === 'labor') {
            updatedProject.laborCost = calculateLaborCost(e.target.value);
        }
        setProject(updatedProject as IProject);
    }

    const handleEditModeToggle = () => {
        if(isEditMode) {
            setProject(savedProject)
        }
        setIsEditMode(!isEditMode);
    }

    const calculateLaborCost:(labor:number) => number = (labor: number) => {
        return labor * 15;
    }

    return (
        <Grid2 container spacing={4} direction="column" size={12}>
            {error && <h1>{error}</h1>}

            {isLoading && <CircularProgress />}
            {project &&
                <>
                    <Grid2 container direction="row" justifyContent='space-between' alignItems='center'>
                        <Typography variant="h2" component="h1">
                            {project.name}
                        </Typography>
                        <Grid2>
                            {!isEditMode &&
                                <IconButton onClick={handleEditModeToggle}>
                                    <Edit />
                                </IconButton>
                            }
                            {isEditMode &&
                                <>
                                    <IconButton onClick={handleSave}>
                                        <Save />
                                    </IconButton>
                                    <IconButton onClick={handleEditModeToggle}>
                                        <Cancel />
                                    </IconButton>
                                </>
                            }
                        </Grid2>
                    </Grid2>
	                <Grid2 container data-testid="image-and-info" direction="row" size={12} spacing={4}>
                        <Grid2 size={4.5} sx={{minHeight: '420px'}} container direction="column">
                            <Grid2 sx={{minHeight: '420px'}}>
                                <img className='project-image' src={project?.image as string ?? '/magpie-bw.svg'} alt=''/>
                            </Grid2>
                              {isEditMode &&
                                <Grid2>
                                    <FormControl>
                                        <Button
                                            component="label"
                                            role={undefined}
                                            variant="contained"
                                            tabIndex={-1}
                                            startIcon={<CloudUpload />}
                                        >
                                            Choose Image
                                            <VisuallyHiddenInput
                                                type="file"
                                                name='image'
                                                onChange={handleImageChange}
                                                multiple
                                            />
                                        </Button>
                                    </FormControl>
                                </Grid2>
                              }
                        </Grid2>
                        <Grid2 size={7} sx={{padding: '0 2em 2em 2em'}} container direction="column" spacing={2} justifyContent='flex-start' alignItems='flex-start'>
                            <Grid2 size={12}>
                                <Typography variant='h5' component="h2" color='primary'>Project Information</Typography>
                            </Grid2>
                            <Grid2 container direction="row" justifyContent='flex-start' alignItems='flex-start'>
                                <Grid2><Typography variant='subtitle1'>Labor:</Typography></Grid2>
                                <Grid2>
                                    {!isEditMode && <Typography>{project.labor ?? 0}</Typography>}
                                    {isEditMode && <Input
                                        name="labor"
                                        type="number"
                                        value={project.labor ?? 0}
                                        onChange={handleInputChange}
                                    />}
                                </Grid2>
                            </Grid2>
	                        <Grid2 container direction="row" justifyContent='flex-start' alignItems='flex-start'>
		                        <Grid2><Typography variant='subtitle1'>Labor cost:</Typography></Grid2>
		                        <Grid2><Typography>{project.laborCost ?? 0}</Typography></Grid2>
	                        </Grid2>
                        </Grid2>
                    </Grid2>
	                <Grid2>
                      {!isEditMode && <Typography className='whitespace-fix'>{project.description}</Typography>}
                        {isEditMode && <TextField
                            name="description"
                            onChange={handleInputChange}
                            multiline
                            fullWidth
                            value={project.description}
                            />
                        }
                    </Grid2>
                </>
            }


        </Grid2>
    );
}

export default Project;