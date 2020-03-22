import { ITextItem } from "@rocketfuel/core/text";

export class GameFlow
{
	private state: number = 0;
	private delay: number = 1;
	private readonly reset: () => void;
	private readonly phases: Array< { text: () => void, voice: () => number, delay: number } >;

	/**
	 *
	 */
	public constructor( reset: () => void, phases: Array< { text: () => void, voice: () => number, delay: number } > )
	{
		this.reset = reset;
		this.phases = phases;
	}

	/**
	 *
	 */
	public Update( deltaTime: number ): void
	{
		this.delay -= deltaTime;
		if( this.delay < 0 )
		{
			if( this.state >= this.phases.length )
			{
				this.delay = 1;
				this.state = 0;
				this.reset();
			}
			else
			{
				this.delay = this.phases[ this.state ].voice() + this.phases[ this.state ].delay;
				this.phases[ this.state ].text();
				this.state++;
			}
		}
	}
}
