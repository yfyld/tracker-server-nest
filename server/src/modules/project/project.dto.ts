import { IsNotEmpty, IsDefined, IsInt } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class AddProjectDto {
    @ApiModelProperty()
    @IsDefined()
    @IsNotEmpty({ message: '项目名称不能为空' })
    name: string;


}

export class UpdateProjectDto {
    @ApiModelProperty()
    @IsDefined()
    @IsInt({message: '项目ID必须是整数'})
    id: number;

    
}


export class ProjectDto {
    @ApiModelProperty()
    @IsDefined()
    @IsInt({message: '项目ID必须是整数'})
    id: number;



    @ApiModelProperty()
    @IsDefined()
    @IsNotEmpty({ message: '项目名称不能为空' })
    name: string;
    
}