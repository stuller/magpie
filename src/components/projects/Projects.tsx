import * as React from 'react';
import {Button, Card, CardContent, CardMedia, Grid2, IconButton, Link, Typography} from "@mui/material";
import { ISupply } from '../supplies/SupplyList';
import {getUrl} from "aws-amplify/storage";
import {useEffect} from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CreateProjectModal from "./CreateProjectModal.tsx";

interface IProps {
    client: any
}

export interface IProject{
    id: string;
    name: string;
    description: string,
    supplies: ISupply[],
    supplyCost: number,
    labor: number,
    laborCost: number,
    price: number,
    units: number,
    image: string|URL|null,
}

function CircularProgress() {
    return null;
}

const Projects:React.FC<IProps> = (props:IProps) => {
    const {client} = props;
    const [projects, setProjects] = React.useState<IProject[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState<boolean>(false);

    useEffect(() => {

        setIsLoading(true);
        (async () => {
            await fetchProjects();
        })()

        setIsLoading(false);
    }, []);

    const handleCreateModalClose = async () => {
        setIsCreateModalOpen(false);
        await fetchProjects();
    }

    async function fetchProjects() {
        const { data: projects } = await client.models.Project.list();
        await Promise.all(
            projects.map(async (project: IProject) => {
                if (project.image) {
                    const linkToStorageFile = await getUrl({
                        path: ({ identityId }) => `media/${identityId}/${project.image}`,
                    });
                    project.image = linkToStorageFile.url;
                }
                return project;
            })
        );
        setProjects(projects);
    }

    return (
        <Grid2 container spacing={4} direction="column" size={12}>
            <Grid2><Typography variant="h2" component="h1">Projects</Typography></Grid2>
            <Grid2>
                <IconButton onClick={() => setIsCreateModalOpen(true)}><AddBoxIcon/></IconButton>
                <Button variant="text" onClick={() => setIsCreateModalOpen(true)}>Add new project</Button>
            </Grid2>
            {isLoading && <CircularProgress />}
            <Grid2 container spacing={4} direction="row" size={12} alignItems="stretch">
                {projects.map((project:IProject) => {
                    const projectImage: string = project?.image as string ?? '/magpie-bw.svg'
                    return (
                        <Grid2 key={project.id} size={3}>
                            <Card sx={{height: '100%'}}>
                                <CardMedia
                                    sx={{ minHeight: 140, width: 'auto' }}
                                    image={projectImage}
                                    title={project.name}
                                />
                                <CardContent>
                                    <Typography variant='h6' component='h2'><Link href={`/project/${project.id}`}>{project.name}</Link></Typography>
                                    <Typography noWrap>{project.description}</Typography>
                                </CardContent>
                            </Card>
                        </Grid2>
                    )
                })}
            </Grid2>
            <CreateProjectModal isOpen={isCreateModalOpen} handleClose={handleCreateModalClose}/>
        </Grid2>
    );
};

export default Projects;