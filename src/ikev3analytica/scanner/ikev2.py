from scapy.all import IP, UDP, Raw, IKEv2, IKEv2_payload_SA, IKEv2_payload_Proposal, IKEv2_payload_Transform
from ikev3analytica.utils.logger import logger
import socket
import asyncio
import os

class IKEv2Scanner:
    """IKEv2 Scanning and Enumeration Engine."""
    def __init__(self, target: str, port: int = 500):
        self.target = target
        self.port = port

    def create_ike_sa_init_packet(self):
        """Creates an IKEv2 IKE_SA_INIT request packet."""
        # Simple IKEv2 Proposal: AES-CBC-128, HMAC-SHA1-96, PRF-HMAC-SHA1, DH Group 2
        trans1 = IKEv2_payload_Transform(transform_type="ENCAR", transform_id="AES_CBC", 
                                        attributes=[("KeyLength", 128)])
        trans2 = IKEv2_payload_Transform(transform_type="INTEG", transform_id="HMAC_SHA1_96")
        trans3 = IKEv2_payload_Transform(transform_type="PRF", transform_id="PRF_HMAC_SHA1")
        trans4 = IKEv2_payload_Transform(transform_type="D-H", transform_id="1024MODP")
        
        prop = IKEv2_payload_Proposal(proposal_number=1, proto="IKEv2", trans_nb=4, 
                                     trans=trans1/trans2/trans3/trans4)
        
        sa = IKEv2_payload_SA(prop=prop)
        
        i_spi = os.urandom(8)
        ikev2 = IKEv2(init_SPI=i_spi, resp_SPI=b"\x00"*8, next_payload="SA", 
                     exch_type="IKE_SA_INIT", flags="Initiator") / sa
        return ikev2

    async def scan(self):
        """Performs IKEv2 scan by sending an IKE_SA_INIT request."""
        logger.info(f"Scanning {self.target}:{self.port} for IKEv2...")
        
        packet = self.create_ike_sa_init_packet()
        
        try:
            loop = asyncio.get_event_loop()
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.setblocking(False)
            
            await loop.sock_sendto(sock, bytes(packet), (self.target, self.port))
            
            # Use run_in_executor for recvfrom as it's typically blocking even with setblocking(False) on some OS
            # or use wait_for with loop.sock_recvfrom if available and preferred.
            # Here we'll stick to a simple wait approach.
            
            # Note: Scapy's IKEv2 is more complex. We'll simplify for the initial scanner skeleton.
            data, addr = await loop.run_in_executor(None, sock.recvfrom, 4096)
            
            if data:
                response = IKEv2(data)
                logger.info(f"[green]Received response from {addr}[/green]")
                return {
                    "protocol": "IKEv2",
                    "status": "Open",
                    "response": response.summary(),
                    "details": "IKEv2 service detected"
                }
        except socket.timeout:
            logger.warning(f"Timeout while scanning {self.target} for IKEv2.")
        except Exception as e:
            logger.debug(f"IKEv2 scan detail: {str(e)}")
        
        return {"protocol": "IKEv2", "status": "Closed/Filtered"}
