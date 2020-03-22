import { Engine } from "@rocketfuel/core/engine";
import { SingleChildNode } from "@rocketfuel/core/nodes";
import { IJSONObject, JSONUtil } from "@rocketfuel/core/util";
import { GameNode } from "./GameNode";

export class App extends SingleChildNode
{
	/**
	 * Creates an instance of the App.
	 */
	public constructor( engine: Engine )
	{
		super( "AppRoot" );

		const configData = engine.DownloadManager.GetJson( "Config.json" );
		const appConfig = JSONUtil.GetAssertedAsType< IAppConfig >( configData, "App" );

		engine.NodeFactory.Set( "GameNode", GameNode.Create );
		const scene = engine.NodeFactory.Create( engine, appConfig.SceneNode );

		this.SetChild( scene );
	}

}

interface IAppConfig
{
	SceneNode: IJSONObject;
}
